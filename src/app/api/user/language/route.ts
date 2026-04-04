import { NextRequest } from 'next/server';
import { isSupportedLanguage, defaultLanguage } from '@/i18n/messages';

// In-memory store for demo purposes. In production, use a database.
const userLanguageStore = new Map<string, string>();

/**
 * GET /api/user/language
 * Returns the user's language preference
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const userId = authHeader?.startsWith('Bearer ') ? 'user1' : 'anonymous';

    const language = userLanguageStore.get(userId) || defaultLanguage;

    return Response.json({
      success: true,
      language,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Failed to get language preference' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/language
 * Updates the user's language preference
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { language } = body;

    if (!language || !isSupportedLanguage(language)) {
      return Response.json(
        { success: false, error: 'Invalid or unsupported language' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('Authorization');
    const userId = authHeader?.startsWith('Bearer ') ? 'user1' : 'anonymous';

    userLanguageStore.set(userId, language);

    return Response.json({
      success: true,
      language,
      message: `Language preference updated to ${language}`,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Failed to update language preference' },
      { status: 500 }
    );
  }
}
