import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Almarai } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { getLocaleDirection, routing } from "@/i18n/routing";
import { AppProviders } from "@/providers";

const almarai = Almarai({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps) {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "Metadata" });

  return {
    applicationName: t("title"),
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={getLocaleDirection(locale)}
      suppressHydrationWarning
      className={`${almarai.variable} h-full`}
    >
      <body className={`${almarai.className} min-h-full antialiased`}>
        <NextIntlClientProvider>
          <AppProviders>
            <div className="flex min-h-full flex-col">
              <SiteHeader />
              <div className="flex flex-1 flex-col">{children}</div>
            </div>
            <Toaster richColors position="top-center" />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
