// RTL Language Support for GuardianChain
// Handles right-to-left layout detection and configuration

const RTL_LANGUAGES = new Set([
  'ar', // Arabic
  'he', // Hebrew
  'fa', // Persian/Farsi
  'ur', // Urdu
  'ps', // Pashto
  'sd', // Sindhi
  'ug', // Uyghur
  'yi', // Yiddish
  'ji', // Yiddish (alternate)
  'iw', // Hebrew (legacy)
  'ku', // Kurdish
  'dv', // Divehi
  'arc', // Aramaic
  'bcc', // Balochi
  'bqi', // Bakhtiari
  'ckb', // Central Kurdish
  'glk', // Gilaki
  'lrc', // Northern Luri
  'mzn', // Mazanderani
  'pnb', // Western Punjabi
  'prs', // Dari
  'sd-arab', // Sindhi (Arabic script)
  'ug-arab', // Uyghur (Arabic script)
  'uz-arab'  // Uzbek (Arabic script)
]);

/**
 * Check if a language code represents a right-to-left language
 * @param lang - Language code (e.g., 'ar', 'he', 'en')
 * @returns boolean indicating if the language is RTL
 */
export function detectUserLanguage(): string {
  // Check localStorage first
  const savedLang = localStorage.getItem('userLanguage');
  if (savedLang) return savedLang;
  
  // Fall back to browser language
  return navigator.language.split('-')[0] || 'en';
}

export function isRTL(lang: string): boolean {
  if (!lang) return false;
  
  // Normalize language code (remove region/script suffixes for basic check)
  const baseLang = lang.toLowerCase().split('-')[0];
  
  return RTL_LANGUAGES.has(lang.toLowerCase()) || RTL_LANGUAGES.has(baseLang);
}

/**
 * Get CSS direction attribute for a language
 * @param lang - Language code
 * @returns 'rtl' or 'ltr'
 */
export function getTextDirection(lang: string): 'rtl' | 'ltr' {
  return isRTL(lang) ? 'rtl' : 'ltr';
}

/**
 * Get text alignment for a language
 * @param lang - Language code
 * @returns CSS text-align value
 */
export function getTextAlign(lang: string): 'left' | 'right' | 'start' | 'end' {
  return isRTL(lang) ? 'right' : 'left';
}

/**
 * Get flex direction classes for RTL support
 * @param lang - Language code
 * @returns Tailwind CSS classes for proper flex direction
 */
export function getFlexDirection(lang: string): string {
  return isRTL(lang) ? 'flex-row-reverse' : 'flex-row';
}

/**
 * Get margin/padding direction classes for RTL support
 * @param lang - Language code
 * @param spacing - Spacing value (e.g., '4', '8')
 * @returns Object with appropriate margin classes
 */
export function getDirectionalSpacing(lang: string, spacing: string) {
  const isRtl = isRTL(lang);
  return {
    marginLeft: isRtl ? `mr-${spacing}` : `ml-${spacing}`,
    marginRight: isRtl ? `ml-${spacing}` : `mr-${spacing}`,
    paddingLeft: isRtl ? `pr-${spacing}` : `pl-${spacing}`,
    paddingRight: isRtl ? `pl-${spacing}` : `pr-${spacing}`,
  };
}

/**
 * Apply RTL-aware container styles
 * @param lang - Language code
 * @returns CSS classes and attributes for container elements
 */
export function getRTLContainerProps(lang: string) {
  const direction = getTextDirection(lang);
  const textAlign = getTextAlign(lang);
  
  return {
    dir: direction,
    className: `text-${textAlign}`,
    style: {
      direction,
      textAlign
    }
  };
}

/**
 * Get language-specific font family
 * @param lang - Language code
 * @returns CSS font-family value
 */
export function getLanguageFont(lang: string): string {
  const fontMap: Record<string, string> = {
    'ar': 'Noto Sans Arabic, Arial, sans-serif',
    'he': 'Noto Sans Hebrew, Arial, sans-serif',
    'fa': 'Noto Sans Persian, Arial, sans-serif',
    'ur': 'Noto Sans Urdu, Arial, sans-serif',
    'default': 'Inter, system-ui, sans-serif'
  };
  
  return fontMap[lang] || fontMap.default;
}

/**
 * Transform icon direction for RTL languages
 * @param lang - Language code
 * @returns CSS transform for icons
 */
export function getIconTransform(lang: string): string {
  return isRTL(lang) ? 'scaleX(-1)' : 'none';
}