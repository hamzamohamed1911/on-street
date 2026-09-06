import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ScanQr } from "@/components/home/scan-qr";
import { routing } from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
      <section className="w-full max-w-md rounded-2xl bg-card p-6 text-card-foreground shadow-lg sm:p-8">
        <ScanQr />
      </section>
    </main>
  );
}
