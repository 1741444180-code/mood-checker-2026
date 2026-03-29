import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { DeactivateAccountResponse } from '@/types/user';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest): Promise<Response> {
  try {
    // Extract user ID from authentication (this would come from middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      const response: DeactivateAccountResponse = { 
        success: false, 
        error: 'Unauthorized' 
      };
      return Response.json(response, { status: 401 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true
      }
    });

    if (!user) {
      const response: DeactivateAccountResponse = { 
        success: false, 
        error: 'User not found' 
      };
      return Response.json(response, { status: 404 });
    }

    if (!user.isActive) {
      const response: DeactivateAccountResponse = { 
        success: false, 
        error: 'Account already deactivated' 
      };
      return Response.json(response, { status: 400 });
    }

    // Perform soft deletion - mark as inactive instead of hard deleting
    // This preserves data integrity while deactivating the account
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        deactivatedAt: new Date(),
        settings: null, // Clear settings
        privacy: null, // Clear privacy settings
        updatedAt: new Date(),
      },
    });

    // Optionally, anonymize other related data here
    // For example, remove references to user in other tables while preserving data integrity
    await prisma.userProfile.updateMany({
      where: { userId: userId },
      data: {
        displayName: '[Deactivated Account]',
        bio: null,
        avatar: null,
        updatedAt: new Date(),
      },
    });

    // Also clear any related preferences
    await prisma.userPreferences.updateMany({
      where: { userId: userId },
      data: {
        theme: null,
        language: null,
        timezone: null,
        updatedAt: new Date(),
      },
    });

    const response: DeactivateAccountResponse = { 
      success: true, 
      message: 'Account has been successfully deactivated',
      deactivatedUserId: updatedUser.id
    };
    return Response.json(response);
  } catch (error: any) {
    console.error('Error deactivating user account:', error);
    const response: DeactivateAccountResponse = { 
      success: false, 
      error: error.message || 'Failed to deactivate account' 
    };
    return Response.json(response, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Optional: Hard delete endpoint (more dangerous, typically not recommended)
// This would completely remove the user from the system
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // This endpoint would completely remove the user from the system
    // Only use this if absolutely necessary and with additional verification
    const userId = request.headers.get('x-user-id'); // Placeholder for actual auth
    
    if (!userId) {
      const response: DeactivateAccountResponse = { 
        success: false, 
        error: 'Unauthorized' 
      };
      return Response.json(response, { status: 401 });
    }

    // Additional verification would go here (like confirming the request multiple times)
    // This is intentionally not fully implemented as soft deletion is preferred
    // In a real implementation, you'd want multiple confirmations and perhaps a waiting period

    const response: DeactivateAccountResponse = { 
      success: false,
      error: 'Hard deletion endpoint requires additional verification',
      message: 'Complete account removal requires extended verification process'
    };
    return Response.json(response, { status: 400 });
  } catch (error: any) {
    console.error('Error with account deletion request:', error);
    const response: DeactivateAccountResponse = { 
      success: false, 
      error: error.message || 'Failed to process deletion request' 
    };
    return Response.json(response, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}