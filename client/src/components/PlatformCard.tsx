import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { IconType } from 'react-icons';

interface PlatformCardProps {
  platform: {
    id: string;
    name: string;
    icon: LucideIcon | IconType;
    description: string;
  };
  isSelected: boolean;
  onToggle: () => void;
  'data-testid'?: string;
}

export function PlatformCard({ platform, isSelected, onToggle, 'data-testid': testId }: PlatformCardProps) {
  const Icon = platform.icon;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative p-4 rounded-md border-2 transition-all hover-elevate ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-background'
      }`}
      data-testid={testId}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}

      {/* Icon */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className={`w-10 h-10 flex items-center justify-center ${
          isSelected ? 'text-primary' : 'text-muted-foreground'
        }`}>
          <Icon className="w-10 h-10" />
        </div>

        {/* Name */}
        <div>
          <div className={`text-base font-bold ${
            isSelected ? 'text-foreground' : 'text-foreground'
          }`}>
            {platform.name}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {platform.description}
          </div>
        </div>
      </div>
    </button>
  );
}
