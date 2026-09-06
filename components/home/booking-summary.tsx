import { getTranslations } from "next-intl/server";

export async function BookingSummary() {
  const t = await getTranslations("HomePage");

  return (
    <aside className="rounded-2xl bg-card p-5 text-start text-card-foreground shadow-lg sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-sm font-extrabold text-foreground">{t("summaryTitle")}</h2>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {t("summaryDescription")}
      </p>
    </aside>
  );
}
