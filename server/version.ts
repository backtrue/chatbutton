const DEFAULT_WIDGET_VERSION = '1.0.0';

function normalize(value: string | undefined): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

type PossiblyNodeGlobal = typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

const env: Record<string, string | undefined> | undefined =
  (globalThis as PossiblyNodeGlobal).process?.env;

export function getWidgetVersion(): string {
  return (
    normalize(env?.WIDGET_VERSION) ||
    normalize(env?.WIDGET_BUILD_ID) ||
    normalize(env?.COMMIT_SHA) ||
    normalize(env?.npm_package_version) ||
    DEFAULT_WIDGET_VERSION
  );
}
