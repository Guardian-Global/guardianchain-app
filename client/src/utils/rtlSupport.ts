// RTL language support utilities

export const RTL_LANGUAGES = [
  "ar",
  "he",
  "fa",
  "ur",
  "ps",
  "sd",
  "ku",
  "yi",
  "ji",
  "iw",
  "arc",
  "bcc",
  "bqi",
  "ckb",
  "dv",
  "fa-AF",
  "fa-IR",
  "glk",
  "he-IL",
  "khw",
  "ks",
  "lrc",
  "mzn",
  "pnb",
  "ps-AF",
  "ps-PK",
  "sd-IN",
  "sd-PK",
  "ug",
  "ur-IN",
  "ur-PK",
];

export function isRTL(language: string): boolean {
  return RTL_LANGUAGES.includes(language?.toLowerCase());
}

export function getRTLContainerProps(isRTL: boolean) {
  return {
    dir: isRTL ? ("rtl" as const) : ("ltr" as const),
    style: {
      textAlign: isRTL ? ("right" as const) : ("left" as const),
    },
  };
}

export function detectUserLanguage(): string {
  // Check localStorage first
  const stored = localStorage.getItem("user-language");
  if (stored) return stored;

  // Check browser language
  const browserLang = navigator.language.split("-")[0];
  return browserLang || "en";
}

export function setUserLanguage(language: string) {
  localStorage.setItem("user-language", language);
}

export function getTextDirection(language: string): "ltr" | "rtl" {
  return isRTL(language) ? "rtl" : "ltr";
}

export function getFlexDirection(language: string, reverse = false): string {
  const isRTLLang = isRTL(language);
  if (reverse) {
    return isRTLLang ? "flex-row" : "flex-row-reverse";
  }
  return isRTLLang ? "flex-row-reverse" : "flex-row";
}

export function getTextAlignment(
  language: string,
): "left" | "right" | "center" {
  return isRTL(language) ? "right" : "left";
}

export function getMarginDirection(language: string): {
  marginLeft?: string;
  marginRight?: string;
} {
  return isRTL(language) ? { marginRight: "auto" } : { marginLeft: "auto" };
}

export function getPaddingDirection(
  language: string,
  size: string = "1rem",
): { paddingLeft?: string; paddingRight?: string } {
  return isRTL(language) ? { paddingRight: size } : { paddingLeft: size };
}
