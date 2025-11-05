import { useState } from 'react';
import { MessageCircle, Phone, Mail, Instagram, ChevronUp, ChevronDown } from 'lucide-react';
import { SiLine, SiMessenger, SiWhatsapp } from 'react-icons/si';
import { PLATFORM_COLORS } from '@shared/platformColors';

interface ButtonPreviewProps {
  platforms: string[];
  position: 'bottom-left' | 'bottom-right';
  color: string;
}

const platformIcons: Record<string, any> = {
  line: SiLine,
  messenger: SiMessenger,
  whatsapp: SiWhatsapp,
  instagram: Instagram,
  phone: Phone,
  email: Mail,
};

export function ButtonPreview({ platforms, position, color }: ButtonPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (platforms.length === 0) {
    return (
      <div className="absolute bottom-6 right-6 text-sm text-muted-foreground">
        請選擇至少一個平台來查看預覽
      </div>
    );
  }

  const positionClass = position === 'bottom-left' ? 'left-6' : 'right-6';

  return (
    <div className={`absolute bottom-6 ${positionClass} flex flex-col gap-3 items-center`}>
      {/* Platform Buttons - appear when expanded (top of stack) */}
      <div 
        className={`flex flex-col gap-3 items-center transition-all duration-200 ${
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {platforms.map((platform) => {
          const Icon = platformIcons[platform];
          const platformColor = PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS] || color;
          return (
            <div
              key={platform}
              className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110"
              style={{ backgroundColor: platformColor }}
              data-testid={`preview-button-${platform}`}
            >
              {Icon && <Icon className="w-6 h-6" />}
            </div>
          );
        })}
      </div>

      {/* Main FAB Button - user's custom color (middle) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-transform hover:scale-105 relative"
        style={{ backgroundColor: color }}
        data-testid="preview-main-button"
        title="點擊切換展開/收合"
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center">
          {isExpanded ? (
            <ChevronUp className="w-3 h-3 text-gray-700" />
          ) : (
            <ChevronDown className="w-3 h-3 text-gray-700" />
          )}
        </div>
      </button>

      {/* Backlink - 報數據 (SEO critical: rel="noopener" ONLY) - appears at BOTTOM */}
      <div className="text-xs text-gray-500 text-center">
        <a 
          href="https://thinkwithblack.com" 
          target="_blank" 
          rel="noopener"
          className="hover:text-gray-700"
          data-testid="preview-backlink"
        >
          報數據
        </a>
      </div>
    </div>
  );
}
