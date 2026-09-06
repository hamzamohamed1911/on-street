"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";
import { ZoneCard } from "@/components/home/zone-card";
import { ZoneCardSkeleton } from "@/components/home/zone-card-skeleton";
import { fetchZone } from "@/lib/api/zones";

type ZoneListProps = {
  qrId: string;
};

export function ZoneList({ qrId }: ZoneListProps) {
  const t = useTranslations("HomePage");
  const [zoneId, setZoneId] = useQueryState(
    "zone",
    parseAsInteger.withOptions({ history: "replace" }),
  );

  const zoneQuery = useQuery({
    queryKey: ["zone", qrId],
    queryFn: () => fetchZone(qrId),
    enabled: Boolean(qrId),
  });

  const zone = zoneQuery.data;

  useEffect(() => {
    if (zone && zoneId !== zone.id) {
      void setZoneId(zone.id);
    }
  }, [zone, zoneId, setZoneId]);

  return (
    <div className="mt-4">
      <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
        {t("zoneTimeDescription")}
      </p>

      {zoneQuery.isPending ? (
        <div className="mt-4">
          <ZoneCardSkeleton />
        </div>
      ) : null}

      {zoneQuery.isError ? (
        <p className="mt-4 text-xs text-destructive">
          {zoneQuery.error instanceof Error
            ? zoneQuery.error.message
            : t("zonesError")}
        </p>
      ) : null}

      {zone ? (
        <div className="mt-4 max-w-md">
          <ZoneCard zone={zone} />
        </div>
      ) : null}
    </div>
  );
}
