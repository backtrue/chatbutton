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

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
      {PRESET_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onChange(color.value)}
          className={`w-12 h-12 rounded-md transition-all hover-elevate ${
            value === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
          }`}
          style={{ backgroundColor: color.value }}
          title={color.name}
          data-testid={`color-${color.value}`}
        />
      ))}
    </div>
  );
}
