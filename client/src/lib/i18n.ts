// P3: Multi-language support preparation
// Currently using zh-TW by default, structure ready for P3 expansion

export type Language = 'zh-TW' | 'ja' | 'en';

export const translations = {
  'zh-TW': {
    backlink: '報數據',
  },
  'ja': {
    backlink: 'レポートデータ',
  },
  'en': {
    backlink: 'Report Data',
  },
};

export function getBacklinkText(lang: Language = 'zh-TW'): string {
  return translations[lang].backlink;
}

export function getBacklinkUrl(): string {
  return 'https://thinkwithblack.com';
}
