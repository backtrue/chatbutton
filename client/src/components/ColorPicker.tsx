import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  { name: '藍色', value: '#2563eb' },
  { name: '綠色', value: '#16a34a' },
  { name: '紅色', value: '#dc2626' },
  { name: '紫色', value: '#9333ea' },
  { name: '橙色', value: '#ea580c' },
  { name: '粉色', value: '#db2777' },
  { name: '青色', value: '#0891b2' },
  { name: '黑色', value: '#171717' },
];

// Helper to validate and normalize color input
function normalizeColor(input: string): string | null {
  const trimmed = input.trim();
  
  // Hex format: #RGB or #RRGGBB
  const hexMatch = trimmed.match(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      // Expand #RGB to #RRGGBB
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    return `#${hex}`;
  }
  
  // RGB format: rgb(r, g, b)
  const rgbMatch = trimmed.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    if (r <= 255 && g <= 255 && b <= 255) {
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }
  
  return null;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [customInput, setCustomInput] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleCustomInput = (input: string) => {
    setCustomInput(input);
    
    if (!input) {
      setIsValid(true);
      return;
    }
    
    const normalized = normalizeColor(input);
    if (normalized) {
      setIsValid(true);
      onChange(normalized);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preset colors grid */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {PRESET_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => {
              onChange(color.value);
              setCustomInput('');
              setIsValid(true);
            }}
            className={`w-12 h-12 rounded-md transition-all hover-elevate ${
              value === color.value && !customInput ? 'ring-2 ring-offset-2 ring-primary' : ''
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
            data-testid={`color-preset-${color.value}`}
          />
        ))}
      </div>

      {/* Custom color input */}
      <div className="space-y-2">
        <Label htmlFor="custom-color" className="text-sm text-muted-foreground">
          或輸入自訂顏色
        </Label>
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <Input
              id="custom-color"
              type="text"
              placeholder="#FF5733 或 rgb(255, 87, 51)"
              value={customInput}
              onChange={(e) => handleCustomInput(e.target.value)}
              className={!isValid ? 'border-destructive' : ''}
              data-testid="input-custom-color"
            />
            {!isValid && (
              <p className="text-xs text-destructive mt-1">
                請輸入有效的顏色格式（例如：#FF5733 或 rgb(255, 87, 51)）
              </p>
            )}
          </div>
          <div
            className="w-12 h-12 rounded-md border-2 border-border flex-shrink-0"
            style={{ backgroundColor: value }}
            title={`當前顏色：${value}`}
            data-testid="color-preview"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          支援格式：#FF5733、#f57、rgb(255, 87, 51)
        </p>
      </div>
    </div>
  );
}
