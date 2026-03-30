import { NextRequest } from 'next/server';
import { encryptSensitiveData, decryptSensitiveData } from '@/utils/encryption';
import { PrismaClient } from '@prisma/client';
import { 
  UserPrivacy, 
  UpdatePrivacyRequest, 
  GetUserSettingsResponse, 
  UpdateSettingsResponse 
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

    const requestData: UpdatePrivacyRequest = await request.json();
    const privacyData: UserPrivacy = requestData.privacy;
    
    // Validate required fields
    if (!privacyData) {
      const response: GetUserSettingsResponse = { 
        success: false, 
        error: 'Privacy data is required' 
      };
      return Response.json(response, { status: 400 });
    }
    
    // Process privacy settings with encryption for sensitive fields
    const processedPrivacy: UserPrivacy = { ...privacyData };
    
    // Encrypt sensitive privacy data if present
    if (privacyData.profileVisibility) {
      processedPrivacy.profileVisibility = encryptSensitiveData(
        privacyData.profileVisibility
      );
    }
    
    if (privacyData.dataSharingConsent !== undefined) {
      processedPrivacy.dataSharingConsent = encryptSensitiveData(
        privacyData.dataSharingConsent.toString()
      );
    }

    // Update user privacy settings in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        privacy: processedPrivacy,
        updatedAt: new Date(),
      },
    });

    // Return success response without sensitive data
    const { password, ...safeUser } = updatedUser;
    const response: UpdateSettingsResponse = { 
      success: true, 
      message: 'Privacy settings updated successfully',
      user: safeUser 
    };
    return Response.json(response);
  } catch (error: any) {
    console.error('Error updating user privacy settings:', error);
    const response: UpdateSettingsResponse = { 
      success: false, 
      error: error.message || 'Failed to update privacy settings' 
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

    // Retrieve user privacy settings from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        privacy: true,
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

    // Decrypt sensitive privacy settings if present
    let decryptedPrivacy: UserPrivacy = { ...user.privacy };
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

    const response: GetUserSettingsResponse = { 
      success: true, 
      privacy: decryptedPrivacy 
    };
    return Response.json(response);
  } catch (error: any) {
    console.error('Error retrieving user privacy settings:', error);
    const response: GetUserSettingsResponse = { 
      success: false, 
      error: error.message || 'Failed to retrieve privacy settings' 
    };
    return Response.json(response, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}