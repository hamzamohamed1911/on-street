import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackToScan } from "@/components/home/back-to-scan";
import { BookingSteps } from "@/components/home/booking-steps";
import { BookingSummary } from "@/components/home/booking-summary";
import { routing } from "@/i18n/routing";

type BookingPageProps = {
  params: Promise<{ locale: string; qr: string }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { locale, qr } = await params;

  if (!hasLocale(routing.locales, locale) || !qr) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <main className="relative flex flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <BackToScan />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <section className="rounded-2xl bg-card p-5 text-start text-card-foreground shadow-lg sm:p-6">
            <Suspense>
              <BookingSteps qrId={qr} />
            </Suspense>
          </section>
          <BookingSummary />
        </div>
      </div>
    </main>
  );
}
