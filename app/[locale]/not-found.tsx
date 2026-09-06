import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFoundPage() {
  const t = await getTranslations("NotFound");

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl bg-card p-5 text-center shadow-lg md:p-6">
        <p className="text-xs font-bold tracking-[0.2em] text-primary-500 uppercase">
          {t("code")}
        </p>
        <p
          className="mt-2 bg-linear-to-b from-primary-500 to-secondary-500 bg-clip-text text-6xl font-extrabold text-transparent sm:text-7xl"
          aria-hidden
        >
          404
        </p>
        <h1 className="mt-3 text-lg font-extrabold text-foreground sm:text-xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("description")}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary-500 px-6 text-sm font-bold text-natural-25 transition-colors hover:bg-primary-500/90"
        >
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}
