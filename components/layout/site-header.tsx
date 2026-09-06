import { BrandLogo } from "./brand-logo";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeSwitcher } from "./theme-switcher";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-transparent">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4">
        <BrandLogo />
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
