import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Instagram,
  Check,
  Shield,
  Sparkles
} from 'lucide-react';
import { SiLine, SiMessenger, SiWhatsapp } from 'react-icons/si';
import { PlatformCard } from '@/components/PlatformCard';
import { ColorPicker } from '@/components/ColorPicker';
import { ButtonPreview } from '@/components/ButtonPreview';
import type { ButtonConfig } from '@shared/schema';

const formSchema = z.object({
  email: z.string().email('請輸入有效的 Email 地址'),
  platforms: z.object({
    line: z.string().optional(),
    messenger: z.string().optional(),
    whatsapp: z.string().optional(),
    instagram: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }).refine(data => Object.values(data).some(v => v && v.trim()), {
    message: "請至少選擇一個平台",
  }),
  position: z.enum(['bottom-left', 'bottom-right']),
  color: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [position, setPosition] = useState<'bottom-left' | 'bottom-right'>('bottom-right');
  const [color, setColor] = useState('#2563eb');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      platforms: {},
      position: 'bottom-right',
      color: '#2563eb',
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/configs', {
        email: data.email,
        configJson: {
          platforms: data.platforms,
          position: data.position,
          color: data.color,
        } as ButtonConfig,
        lang: 'zh-TW',
      });
      return await response.json();
    },
    onSuccess: (response: any, variables: FormData) => {
      // Store data in sessionStorage for success page
      sessionStorage.setItem('widgetCode', response.code);
      sessionStorage.setItem('userEmail', variables.email);
      sessionStorage.setItem('widgetConfigId', response.id);

      // Navigate to success page using wouter (avoids page reload)
      setLocation('/success');
    },
    onError: (error: any) => {
      toast({
        title: '發送失敗',
        description: error.message || '請稍後再試，或聯絡我們的客服團隊。',
        variant: 'destructive',
      });
    },
  });

  const togglePlatform = (platform: string) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platform)) {
      newSelected.delete(platform);
      form.setValue(`platforms.${platform}` as any, '');
    } else {
      newSelected.add(platform);
    }
    setSelectedPlatforms(newSelected);
  };

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  const platforms = [
    { 
      id: 'line', 
      name: 'LINE', 
      icon: SiLine, 
      description: 'LINE 官方帳號 ID',
      placeholder: '例如：@yourlineid',
      inputLabel: 'LINE ID'
    },
    { 
      id: 'messenger', 
      name: 'Messenger', 
      icon: SiMessenger, 
      description: 'Facebook 粉絲專頁名稱',
      placeholder: '例如：yourpagename',
      inputLabel: 'FB 粉專名稱'
    },
    { 
      id: 'whatsapp', 
      name: 'WhatsApp', 
      icon: SiWhatsapp, 
      description: '含國碼的手機號碼',
      placeholder: '例如：886912345678',
      inputLabel: 'WhatsApp 號碼'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      description: 'Instagram 帳號名稱',
      placeholder: '例如：yourusername',
      inputLabel: 'IG 帳號'
    },
    { 
      id: 'phone', 
      name: '電話', 
      icon: Phone, 
      description: '客服電話號碼',
      placeholder: '例如：0212345678',
      inputLabel: '電話號碼'
    },
    { 
      id: 'email', 
      name: 'Email', 
      icon: Mail, 
      description: '客服信箱地址',
      placeholder: '例如：support@example.com',
      inputLabel: 'Email 地址'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">ToldYou Button</h1>
              <p className="text-sm text-muted-foreground mt-1">
                一分鐘完成多平台客服按鈕設定
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">完全免費</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-8 md:p-12 bg-white shadow-md">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Platform Selection */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                選擇您要使用的平台
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                至少選擇一個平台，可以同時選擇多個
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {platforms.map((platform) => (
                  <PlatformCard
                    key={platform.id}
                    platform={platform}
                    isSelected={selectedPlatforms.has(platform.id)}
                    onToggle={() => togglePlatform(platform.id)}
                    data-testid={`platform-card-${platform.id}`}
                  />
                ))}
              </div>

              {/* Platform Input Fields */}
              {platforms.map((platform) => 
                selectedPlatforms.has(platform.id) && (
                  <div key={`input-${platform.id}`} className="mb-6">
                    <Label htmlFor={`platform-${platform.id}`} className="text-base font-medium mb-2 block">
                      {platform.inputLabel}
                    </Label>
                    <Input
                      id={`platform-${platform.id}`}
                      placeholder={platform.placeholder}
                      {...form.register(`platforms.${platform.id}` as any)}
                      className="w-full"
                      data-testid={`input-platform-${platform.id}`}
                    />
                  </div>
                )
              )}

              {form.formState.errors.platforms && (
                <p className="text-sm text-destructive mt-2" data-testid="error-platforms">
                  {form.formState.errors.platforms.message as string}
                </p>
              )}
            </section>

            {/* Button Position */}
            <section className="mb-8">
              <Label className="text-base font-medium mb-2 block">按鈕位置</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setPosition('bottom-left');
                    form.setValue('position', 'bottom-left');
                  }}
                  className={`flex-1 px-4 py-3 border rounded-md text-sm font-medium transition-all hover-elevate ${
                    position === 'bottom-left'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-background text-foreground'
                  }`}
                  data-testid="button-position-left"
                >
                  左下角
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPosition('bottom-right');
                    form.setValue('position', 'bottom-right');
                  }}
                  className={`flex-1 px-4 py-3 border rounded-md text-sm font-medium transition-all hover-elevate ${
                    position === 'bottom-right'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-background text-foreground'
                  }`}
                  data-testid="button-position-right"
                >
                  右下角
                </button>
              </div>
            </section>

            {/* Color Picker */}
            <section className="mb-8">
              <Label className="text-base font-medium mb-2 block">按鈕顏色</Label>
              <ColorPicker
                value={color}
                onChange={(newColor) => {
                  setColor(newColor);
                  form.setValue('color', newColor);
                }}
              />
            </section>

            {/* Preview */}
            <section className="mb-8">
              <Label className="text-base font-medium mb-2 block">預覽效果</Label>
              <div className="bg-gray-100 rounded-lg p-6 relative h-48">
                <ButtonPreview
                  platforms={Object.entries(form.watch('platforms'))
                    .filter(([_, value]) => value)
                    .map(([key]) => key)}
                  position={position}
                  color={color}
                />
              </div>
            </section>

            {/* Email Input */}
            <section className="mb-8">
              <Label htmlFor="email" className="text-base font-medium mb-2 block">
                接收程式碼的 Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...form.register('email')}
                className="w-full"
                data-testid="input-email"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-2" data-testid="error-email">
                  {form.formState.errors.email.message}
                </p>
              )}
              
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>我們絕不會發送垃圾郵件</span>
              </div>
            </section>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full md:w-auto px-8 py-4 text-base font-semibold"
              disabled={submitMutation.isPending}
              data-testid="button-submit"
            >
              {submitMutation.isPending ? '發送中...' : '發送程式碼到我的信箱'}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            © 2024 ToldYou Button ·
            <a
              href="https://thinkwithblack.com"
              target="_blank"
              rel="noopener"
              className="ml-1 text-primary hover:underline"
              data-testid="link-home-footer-backlink"
            >
              報數據
            </a>
          </p>
          <nav className="mt-2 flex items-center justify-center gap-3">
            <Link
              href="/legal/terms"
              className="text-primary hover:underline"
              data-testid="link-home-footer-terms"
            >
              使用者條款
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/legal/privacy"
              className="text-primary hover:underline"
              data-testid="link-home-footer-privacy"
            >
              隱私權政策
            </Link>
          </nav>
        </footer>
      </main>
    </div>
  );
}
