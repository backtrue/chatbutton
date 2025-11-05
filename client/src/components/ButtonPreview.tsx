import { MessageCircle, Phone, Mail, Instagram } from 'lucide-react';
import { SiLine, SiMessenger, SiWhatsapp } from 'react-icons/si';

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
  if (platforms.length === 0) {
    return (
      <div className="absolute bottom-6 right-6 text-sm text-muted-foreground">
        請選擇至少一個平台來查看預覽
      </div>
    );
  }

  const positionClass = position === 'bottom-left' ? 'left-6' : 'right-6';

  return (
    <div className={`absolute bottom-6 ${positionClass} flex flex-col gap-3`}>
      {/* Backlink - 報數據 (SEO critical: rel="noopener" ONLY) - appears at TOP */}
      <div className="text-xs text-gray-500 text-center mb-1">
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

      {/* Platform Buttons - render ALL selected platforms BELOW backlink */}
      {platforms.map((platform) => {
        const Icon = platformIcons[platform];
        return (
          <div
            key={platform}
            className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white"
            style={{ backgroundColor: color }}
            data-testid={`preview-button-${platform}`}
          >
            {Icon && <Icon className="w-6 h-6" />}
          </div>
        );
      })}
    </div>
  );
}
