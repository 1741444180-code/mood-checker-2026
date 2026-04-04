import { NextRequest } from 'next/server';
import { isSupportedLanguage, getCachedTranslations, defaultLanguage, type SupportedLanguage } from '@/i18n/messages';

/**
 * GET /api/i18n/locales?lang=zh-CN
 * Returns the translation data for the specified language
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || defaultLanguage;

    const language: SupportedLanguage = isSupportedLanguage(lang) ? lang : defaultLanguage;
    const translations = getCachedTranslations(language);

    return Response.json({
      success: true,
      language,
      translations,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Failed to load translations' },
      { status: 500 }
    );
  }
}
