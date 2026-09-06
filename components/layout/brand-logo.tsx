import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function BrandLogo() {
  const t = await getTranslations("Header");

  return (
    <Link
      href="/"
      className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
      aria-label={t("home")}
    >
      <Image
        src="/images/logoWhite.svg"
        alt={t("logoAlt")}
        width={240}
        height={102}
        priority
        unoptimized
        className="h-10 w-auto max-w-40 object-contain sm:h-11"
      />
    </Link>
  );
}
