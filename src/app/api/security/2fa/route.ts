import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface TwoFactorAuthData {
  userId: string;
  secret: string;
  enabled: boolean;
  backupCodes: string[];
  createdAt: string;
  updatedAt: string;
}

// In-memory storage (replace with database in production)
const twoFactorData = new Map<string, TwoFactorAuthData>();

// Generate a random base32 secret
function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  const randomBytes = crypto.randomBytes(20);
  for (let i = 0; i < 32; i++) {
    secret += chars[randomBytes[i] % chars.length];
  }
  return secret;
}

// Generate TOTP code
function generateTOTP(secret: string): string {
  const period = 30; // 30 seconds
  const digits = 6;
  const algorithm = 'sha1';

  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / period);
  
  const buffer = Buffer.alloc(8);
  for (let i = 7; i >= 0; i--) {
    buffer[i] = counter & 0xff;
    counter >>> 8;
  }

  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(buffer);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0x0f;
  const binary = ((digest[offset] & 0x7f) << 24) |
                 ((digest[offset + 1] & 0xff) << 16) |
                 ((digest[offset + 2] & 0xff) << 8) |
                 (digest[offset + 3] & 0xff);

  const otp = binary % Math.pow(10, digits);
  return otp.toString().padStart(digits, '0');
}

// Generate backup codes
function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
}

// Verify TOTP code
function verifyTOTP(secret: string, token: string): boolean {
  const expectedToken = generateTOTP(secret);
  return expectedToken === token;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const data = twoFactorData.get(userId);
    
    if (!data) {
      return NextResponse.json({
        success: true,
        data: { enabled: false },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        enabled: data.enabled,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  } catch (error) {
    console.error('2FA GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch 2FA status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'setup': {
        // Generate new 2FA setup
        const secret = generateSecret();
        const backupCodes = generateBackupCodes();
        
        const data: TwoFactorAuthData = {
          userId,
          secret,
          enabled: false,
          backupCodes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        twoFactorData.set(userId, data);

        return NextResponse.json({
          success: true,
          data: {
            secret,
            qrCodeUrl: `otpauth://totp/MoodTracker:${userId}?secret=${secret}&issuer=MoodTracker`,
            backupCodes,
          },
        });
      }

      case 'verify': {
        const { code } = body;
        const data = twoFactorData.get(userId);

        if (!data) {
          return NextResponse.json(
            { success: false, error: '2FA not initialized' },
            { status: 400 }
          );
        }

        const isValid = verifyTOTP(data.secret, code);

        if (!isValid) {
          return NextResponse.json(
            { success: false, error: 'Invalid code' },
            { status: 400 }
          );
        }

        // Enable 2FA
        data.enabled = true;
        data.updatedAt = new Date().toISOString();
        twoFactorData.set(userId, data);

        return NextResponse.json({
          success: true,
          data: { enabled: true },
        });
      }

      case 'enable': {
        const data = twoFactorData.get(userId);
        
        if (!data) {
          return NextResponse.json(
            { success: false, error: '2FA not initialized' },
            { status: 400 }
          );
        }

        data.enabled = true;
        data.updatedAt = new Date().toISOString();
        twoFactorData.set(userId, data);

        return NextResponse.json({
          success: true,
          data: { enabled: true },
        });
      }

      case 'disable': {
        const data = twoFactorData.get(userId);
        
        if (!data) {
          return NextResponse.json(
            { success: false, error: '2FA not enabled' },
            { status: 400 }
          );
        }

        data.enabled = false;
        data.updatedAt = new Date().toISOString();
        twoFactorData.set(userId, data);

        return NextResponse.json({
          success: true,
          data: { enabled: false },
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('2FA POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process 2FA request' },
      { status: 500 }
    );
  }
}

// Middleware helper function for verifying 2FA
export function verifyTwoFactor(userId: string, code: string): boolean {
  const data = twoFactorData.get(userId);
  if (!data || !data.enabled) {
    return true; // 2FA not enabled, allow access
  }
  return verifyTOTP(data.secret, code);
}
