import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function BackToScan() {
  const t = await getTranslations("HomePage");

  return (
    <Link
      href="/"
      className="inline-flex w-fit items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
    >
      <ArrowLeft className="size-4 rtl:rotate-180" />
      {t("backToScan")}
    </Link>
  );
}
