import { useEffect, useMemo, useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  Sparkles,
  Phone,
  Mail,
  Instagram,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SiLine, SiMessenger, SiWhatsapp } from 'react-icons/si';
import type { IconType } from 'react-icons';
import { PlatformCard } from '@/components/PlatformCard';
import { ColorPicker } from '@/components/ColorPicker';
import { ButtonPreview } from '@/components/ButtonPreview';
import type { ButtonConfig } from '@shared/schema';
import { useLanguage } from '@/language/language-context';
import {
  getHomeCopy,
  PLATFORM_IDS,
  type PlatformId,
  type HomeCopy,
} from '@/language/translations';
import {
  getLanguageOptions,
  type Language,
} from '@shared/language';
import { buildLocalizedPath } from '@shared/homeMeta';

function updateMetaTag(name: string, content: string) {
  if (typeof document === 'undefined') {
    return;
  }

  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

type PlatformFormValues = Partial<Record<PlatformId, string>>;

type FormValues = {
  email: string;
  platforms: PlatformFormValues;
  position: 'bottom-left' | 'bottom-right';
  color: string;
};

type PlatformOption = {
  id: PlatformId;
  name: string;
  description: string;
  placeholder: string;
  inputLabel: string;
  icon: LucideIcon | IconType;
};

type SubmitResponse = {
  id: string;
  code: string;
};

type PlatformFieldName = `platforms.${PlatformId}`;

const DEFAULT_FORM_VALUES: FormValues = {
  email: '',
  platforms: {},
  position: 'bottom-right',
  color: '#2563eb',
};

const PLATFORM_ICON_MAP: Record<PlatformId, LucideIcon | IconType> = {
  line: SiLine,
  messenger: SiMessenger,
  whatsapp: SiWhatsapp,
  instagram: Instagram,
  phone: Phone,
  email: Mail,
};

function createFormSchema(copy: HomeCopy) {
  const platformShape = PLATFORM_IDS.reduce(
    (shape, platform) => {
      shape[platform] = z.string().optional();
      return shape;
    },
    {} as Record<PlatformId, z.ZodOptional<z.ZodString>>
  );

  const platformSchema = z.object(platformShape);

  return z.object({
    email: z.string().email(copy.validation.email),
    platforms: platformSchema.refine(
      (data) =>
        PLATFORM_IDS.some((platform) => {
          const value = data[platform];
          return typeof value === 'string' && value.trim().length > 0;
        }),
      {
        message: copy.validation.platform,
      }
    ),
    position: z.enum(['bottom-left', 'bottom-right']),
    color: z.string(),
  }) satisfies z.ZodType<FormValues>;
}

export default function Home() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { language, setLanguage } = useLanguage();

  const copy = useMemo(() => getHomeCopy(language), [language]);
  const resolver = useMemo(() => zodResolver(createFormSchema(copy)), [copy]);

  const form = useForm<FormValues>({
    resolver,
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    void form.trigger();
  }, [copy, form]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = copy.metaTitle;
    }
    updateMetaTag('description', copy.metaDescription);
  }, [copy.metaDescription, copy.metaTitle]);

  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformId>>(() => {
    const initial = new Set<PlatformId>();
    const values = form.getValues('platforms');
    PLATFORM_IDS.forEach((platform) => {
      const value = values?.[platform];
      if (typeof value === 'string' && value.trim().length > 0) {
        initial.add(platform);
      }
    });
    return initial;
  });

  const languageOptions = useMemo(() => getLanguageOptions(), []);
  const platformOptions = useMemo<PlatformOption[]>(
    () =>
      PLATFORM_IDS.map((platform) => ({
        id: platform,
        icon: PLATFORM_ICON_MAP[platform],
        ...copy.platforms[platform],
      })),
    [copy]
  );

  const watchedPlatforms = form.watch('platforms');
  const position = form.watch('position') ?? DEFAULT_FORM_VALUES.position;
  const color = form.watch('color') ?? DEFAULT_FORM_VALUES.color;

  const previewPlatforms = useMemo<PlatformId[]>(
    () =>
      PLATFORM_IDS.filter((platform) => {
        const value = watchedPlatforms?.[platform];
        return typeof value === 'string' && value.trim().length > 0;
      }) as PlatformId[],
    [watchedPlatforms]
  );

  const submitMutation = useMutation<SubmitResponse, Error, { formData: FormValues; lang: Language }>(
    {
      mutationFn: async ({ formData, lang }) => {
        const normalizedPlatforms = Object.fromEntries(
          Object.entries(formData.platforms)
            .map(([key, value]) => [key as PlatformId, value?.trim() ?? ''])
            .filter(([, value]) => value.length > 0)
        ) as ButtonConfig['platforms'];

        const response = await apiRequest('POST', '/api/configs', {
          email: formData.email.trim(),
          configJson: {
            platforms: normalizedPlatforms,
            position: formData.position,
            color: formData.color,
          } satisfies ButtonConfig,
          lang,
        });

        return (await response.json()) as SubmitResponse;
      },
    }
  );

  const togglePlatform = (platform: PlatformId) => {
    const fieldName: PlatformFieldName = `platforms.${platform}`;
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) {
        next.delete(platform);
        form.setValue(fieldName, '', { shouldDirty: true, shouldValidate: true });
      } else {
        next.add(platform);
        const currentValue = form.getValues(fieldName);
        if (currentValue === undefined) {
          form.setValue(fieldName, '', { shouldDirty: false, shouldValidate: false });
        }
      }
      return next;
    });
    void form.trigger('platforms');
  };

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      const response = await submitMutation.mutateAsync({ formData, lang: language });

      sessionStorage.setItem('widgetCode', response.code);
      sessionStorage.setItem('userEmail', formData.email.trim());
      sessionStorage.setItem('widgetConfigId', response.id);

      setLocation(buildLocalizedPath('/success', language));
    } catch (error) {
      console.error('[Home] Failed to submit config', error);
      toast({
        title: copy.toast.errorTitle,
        description: copy.toast.errorDescription,
        variant: 'destructive',
      });
    }
  });

  const platformRootError = form.formState.errors.platforms as
    | { root?: { message?: string } }
    | undefined;
  const platformError = platformRootError?.root?.message;
  const emailError = form.formState.errors.email?.message;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{copy.heroTitle}</h1>
              <p className="text-sm text-muted-foreground mt-1">{copy.tagline}</p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">{copy.freeBadgeLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {copy.languageSelectorLabel}
                </span>
                <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-8 md:p-12 bg-white shadow-md">
          <form onSubmit={handleSubmit}>
            {/* Platform Selection */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {copy.platformSectionTitle}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {copy.platformSectionSubtitle}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {platformOptions.map((platform) => (
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
              {platformOptions.map(
                (platform) =>
                  selectedPlatforms.has(platform.id) && (
                    <div key={`input-${platform.id}`} className="mb-6">
                      <Label
                        htmlFor={`platform-${platform.id}`}
                        className="text-base font-medium mb-2 block"
                      >
                        {platform.inputLabel}
                      </Label>
                      <Input
                        id={`platform-${platform.id}`}
                        placeholder={platform.placeholder}
                        {...form.register(`platforms.${platform.id}`)}
                        className="w-full"
                        data-testid={`input-platform-${platform.id}`}
                      />
                    </div>
                  )
              )}

              {platformError && (
                <p className="text-sm text-destructive mt-2" data-testid="error-platforms">
                  {platformError}
                </p>
              )}
            </section>

            {/* Button Position */}
            <section className="mb-8">
              <Label className="text-base font-medium mb-2 block">
                {copy.buttonPositionLabel}
              </Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => form.setValue('position', 'bottom-left', { shouldDirty: true })}
                  className={`flex-1 px-4 py-3 border rounded-md text-sm font-medium transition-all hover-elevate ${
                    position === 'bottom-left'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-background text-foreground'
                  }`}
                  data-testid="button-position-left"
                >
                  {copy.positions.left}
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue('position', 'bottom-right', { shouldDirty: true })}
                  className={`flex-1 px-4 py-3 border rounded-md text-sm font-medium transition-all hover-elevate ${
                    position === 'bottom-right'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-background text-foreground'
                  }`}
                  data-testid="button-position-right"
                >
                  {copy.positions.right}
                </button>
              </div>
            </section>

            {/* Color Picker */}
            <section className="mb-8">
              <Label className="text-base font-medium mb-2 block">{copy.colorLabel}</Label>
              <ColorPicker
                value={color}
                onChange={(newColor) => form.setValue('color', newColor, { shouldDirty: true })}
              />
            </section>

            {/* Preview */}
            <section className="mb-8">
              <Label className="text-base font-medium mb-2 block">{copy.previewLabel}</Label>
              <div className="bg-gray-100 rounded-lg p-6 relative h-48">
                <ButtonPreview
                  platforms={previewPlatforms}
                  position={position}
                  color={color}
                  emptyHint={copy.previewEmptyHint}
                  toggleTitle={copy.previewToggleTitle}
                  backlinkLabel={copy.previewBacklinkLabel}
                />
              </div>
            </section>

            {/* Email Input */}
            <section className="mb-8">
              <Label htmlFor="email" className="text-base font-medium mb-2 block">
                {copy.emailLabel}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={copy.emailPlaceholder}
                {...form.register('email')}
                className="w-full"
                data-testid="input-email"
              />
              {emailError && (
                <p className="text-sm text-destructive mt-2" data-testid="error-email">
                  {emailError}
                </p>
              )}

              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>{copy.emailHelperText}</span>
              </div>
            </section>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full md:w-auto px-8 py-4 text-base font-semibold"
              disabled={submitMutation.isPending}
              data-testid="button-submit"
            >
              {submitMutation.isPending ? copy.submitPendingLabel : copy.submitLabel}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            © 2024 {copy.heroTitle} ·
            <a
              href="https://thinkwithblack.com"
              target="_blank"
              rel="noopener"
              className="ml-1 text-primary hover:underline"
              data-testid="link-home-footer-backlink"
            >
              {copy.previewBacklinkLabel}
            </a>
          </p>
          <nav className="mt-2 flex items-center justify-center gap-3">
            <Link
              href={copy.footer.termsHref}
              className="text-primary hover:underline"
              data-testid="link-home-footer-terms"
            >
              {copy.footer.termsLabel}
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href={copy.footer.privacyHref}
              className="text-primary hover:underline"
              data-testid="link-home-footer-privacy"
            >
              {copy.footer.privacyLabel}
            </Link>
          </nav>
        </footer>
      </main>
    </div>
  );
}
