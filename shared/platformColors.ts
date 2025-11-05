// Platform brand colors for social media and communication channels

export const PLATFORM_COLORS = {
  line: '#06C755',        // LINE official green
  messenger: '#0084FF',   // Facebook Messenger blue
  whatsapp: '#25D366',    // WhatsApp green
  instagram: '#E4405F',   // Instagram gradient pink (simplified to single color)
  phone: '#10B981',       // Emerald green for phone
  email: '#6366F1',       // Indigo for email
} as const;

export type PlatformId = keyof typeof PLATFORM_COLORS;

// Helper function to get platform color
export function getPlatformColor(platform: PlatformId): string {
  return PLATFORM_COLORS[platform];
}
