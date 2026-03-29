import { NextRequest } from 'next/server';
import { encryptSensitiveData, decryptSensitiveData } from '@/utils/encryption';
import { PrismaClient } from '@prisma/client';
import { 
  UpdateSettingsRequest, 
  GetUserSettingsResponse, 
  UpdateSettingsResponse,
  UserSettings 
} from '@/types/user';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest): Promise<Response> {
  try {
    // Extract user ID from authentication (this would come from middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      const response: GetUserSettingsResponse = { 
        success: false, 
        error: 'Unauthorized' 
      };
      return Response.json(response, { status: 401 });
    }

    const requestData: UpdateSettingsRequest = await request.json();
    const settingsData: UserSettings = requestData.settings;
    
    // Validate required fields
    if (!settingsData) {
      const response: GetUserSettingsResponse = { 
        success: false, 
        error: 'Settings data is required' 
      };
      return Response.json(response, { status: 400 });
    }
    
    // Prepare settings data with encryption for sensitive fields
    const processedSettings: UserSettings = { ...settingsData };
    
    // Encrypt sensitive settings if present
    if (settingsData.email_notification_preferences) {
      processedSettings.email_notification_preferences = encryptSensitiveData(
        JSON.stringify(settingsData.email_notification_preferences)
      );
    }
    
    // Update user settings in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        settings: processedSettings,
        updatedAt: new Date(),
      },
    });

    // Return success response without sensitive data
    const { password, ...safeUser } = updatedUser;
    const response: UpdateSettingsResponse = { 
      success: true, 
      message: 'Settings updated successfully',
      user: safeUser 
    };
    return Response.json(response);
  } catch (error: any) {
    console.error('Error updating user settings:', error);
    const response: UpdateSettingsResponse = { 
      success: false, 
      error: error.message || 'Failed to update settings' 
    };
    return Response.json(response, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Extract user ID from authentication (this would come from middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      const response: GetUserSettingsResponse = { 
        success: false, 
        error: 'Unauthorized' 
      };
      return Response.json(response, { status: 401 });
    }

    // Retrieve user settings from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        settings: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      const response: GetUserSettingsResponse = { 
        success: false, 
        error: 'User not found' 
      };
      return Response.json(response, { status: 404 });
    }

    // Decrypt sensitive settings if present
    let decryptedSettings: UserSettings = { ...user.settings };
    if (user.settings?.email_notification_preferences) {
      try {
        decryptedSettings.email_notification_preferences = JSON.parse(
          decryptSensitiveData(user.settings.email_notification_preferences)
        );
      } catch (e) {
        console.error('Failed to decrypt settings:', e);
        // Return original encrypted value if decryption fails
        decryptedSettings.email_notification_preferences = user.settings.email_notification_preferences as any;
      }
    }

    const response: GetUserSettingsResponse = { 
      success: true, 
      settings: decryptedSettings 
    };
    return Response.json(response);
  } catch (error: any) {
    console.error('Error retrieving user settings:', error);
    const response: GetUserSettingsResponse = { 
      success: false, 
      error: error.message || 'Failed to retrieve settings' 
    };
    return Response.json(response, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}