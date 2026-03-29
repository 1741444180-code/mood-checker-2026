import { NextRequest } from 'next/server';
import { decryptSensitiveData } from '@/utils/encryption';
import { PrismaClient } from '@prisma/client';
import { GetUserDataResponse, UserData } from '@/types/user';

const prisma = new PrismaClient();

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Extract user ID from authentication (this would come from middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      const response: GetUserDataResponse = { 
        success: false, 
        error: 'Unauthorized' 
      };
      return Response.json(response, { status: 401 });
    }

    // Retrieve comprehensive user data from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        deactivatedAt: true,
        settings: true,
        privacy: true,
        userProfile: {
          select: {
            displayName: true,
            bio: true,
            avatar: true,
            dateOfBirth: true,
            gender: true,
            location: true,
            website: true,
            socialLinks: true,
          }
        },
        userPreferences: {
          select: {
            theme: true,
            language: true,
            timezone: true,
            notificationsEnabled: true,
            marketingEmails: true,
          }
        }
      }
    });

    if (!user) {
      const response: GetUserDataResponse = { 
        success: false, 
        error: 'User not found' 
      };
      return Response.json(response, { status: 404 });
    }

    // Decrypt sensitive settings if present
    let decryptedSettings = { ...user.settings };
    if (user.settings?.email_notification_preferences) {
      try {
        decryptedSettings.email_notification_preferences = JSON.parse(
          decryptSensitiveData(
            user.settings.email_notification_preferences
          )
        );
      } catch (e) {
        console.error('Failed to decrypt settings:', e);
        // Return original encrypted value if decryption fails
        decryptedSettings.email_notification_preferences = user.settings.email_notification_preferences as any;
      }
    }

    // Decrypt sensitive privacy settings if present
    let decryptedPrivacy = { ...user.privacy };
    if (user.privacy?.profileVisibility) {
      try {
        decryptedPrivacy.profileVisibility = decryptSensitiveData(
          user.privacy.profileVisibility
        );
      } catch (e) {
        console.error('Failed to decrypt privacy settings:', e);
        // Return original encrypted value if decryption fails
        decryptedPrivacy.profileVisibility = user.privacy.profileVisibility as any;
      }
    }
    
    if (user.privacy?.dataSharingConsent) {
      try {
        decryptedPrivacy.dataSharingConsent = decryptSensitiveData(
          user.privacy.dataSharingConsent
        );
      } catch (e) {
        console.error('Failed to decrypt privacy settings:', e);
        // Return original encrypted value if decryption fails
        decryptedPrivacy.dataSharingConsent = user.privacy.dataSharingConsent as any;
      }
    }

    // Build response with decrypted data
    const userData: UserData = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deactivatedAt: user.deactivatedAt,
      settings: decryptedSettings,
      privacy: decryptedPrivacy,
      profile: user.userProfile,
      preferences: user.userPreferences,
    };

    const response: GetUserDataResponse = { 
      success: true, 
      data: userData 
    };
    return Response.json(response);
  } catch (error: any) {
    console.error('Error retrieving user data:', error);
    const response: GetUserDataResponse = { 
      success: false, 
      error: error.message || 'Failed to retrieve user data' 
    };
    return Response.json(response, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Additional endpoint to export user data in various formats
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const userId = request.headers.get('x-user-id'); // Placeholder for actual auth
    const requestData = await request.json();
    const format = requestData.format; // Expected format: json, csv
    
    if (!userId) {
      const response: GetUserDataResponse = { 
        success: false, 
        error: 'Unauthorized' 
      };
      return Response.json(response, { status: 401 });
    }

    // Get user data (similar to GET method)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        deactivatedAt: true,
        settings: true,
        privacy: true,
        userProfile: {
          select: {
            displayName: true,
            bio: true,
            avatar: true,
            dateOfBirth: true,
            gender: true,
            location: true,
            website: true,
            socialLinks: true,
          }
        },
        userPreferences: {
          select: {
            theme: true,
            language: true,
            timezone: true,
            notificationsEnabled: true,
            marketingEmails: true,
          }
        }
      }
    });

    if (!user) {
      const response: GetUserDataResponse = { 
        success: false, 
        error: 'User not found' 
      };
      return Response.json(response, { status: 404 });
    }

    // Process based on requested format
    switch (format) {
      case 'json':
        // Prepare data with decrypted values
        let exportData = { ...user };
        
        // Decrypt sensitive settings if present
        if (user.settings?.email_notification_preferences) {
          try {
            (exportData.settings as any).email_notification_preferences = JSON.parse(
              decryptSensitiveData(
                user.settings.email_notification_preferences
              )
            );
          } catch (e) {
            console.error('Failed to decrypt settings for export:', e);
          }
        }

        // Decrypt sensitive privacy settings if present
        if (user.privacy?.profileVisibility) {
          try {
            (exportData.privacy as any).profileVisibility = decryptSensitiveData(
              user.privacy.profileVisibility
            );
          } catch (e) {
            console.error('Failed to decrypt privacy for export:', e);
          }
        }
        
        if (user.privacy?.dataSharingConsent) {
          try {
            (exportData.privacy as any).dataSharingConsent = decryptSensitiveData(
              user.privacy.dataSharingConsent
            );
          } catch (e) {
            console.error('Failed to decrypt privacy for export:', e);
          }
        }

        return new Response(JSON.stringify(exportData, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="user-data-${userId}.json"`,
          },
        });
      
      case 'csv':
        // Simplified CSV generation
        const replacer = (key: string, value: any) => value === null ? '' : value;
        const header = Object.keys(user);
        const csvContent = [
          header.join(','), // header row
          header.map(fieldName => JSON.stringify(user[fieldName as keyof typeof user], replacer)).join(',')
        ].join('\r\n');
        
        return new Response(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="user-data-${userId}.csv"`,
          },
        });
      
      default:
        const response: GetUserDataResponse = { 
          success: false, 
          error: 'Unsupported format. Use json or csv.' 
        };
        return Response.json(response, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error exporting user data:', error);
    const response: GetUserDataResponse = { 
      success: false, 
      error: error.message || 'Failed to export user data' 
    };
    return Response.json(response, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}