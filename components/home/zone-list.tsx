"use client";

import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";
import { ZoneCard } from "@/components/home/zone-card";
import type { ParkingZone } from "@/lib/zones";

type ZoneListProps = {
  zone: ParkingZone | null;
  error?: string | null;
};

export function ZoneList({ zone, error }: ZoneListProps) {
  const t = useTranslations("HomePage");
  const [zoneId, setZoneId] = useQueryState(
    "zone",
    parseAsInteger.withOptions({ history: "replace" }),
  );

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

      {error ? (
        <p className="mt-4 text-xs text-destructive">{error}</p>
      ) : null}

      {zone ? (
        <div className="mt-4 max-w-md">
          <ZoneCard zone={zone} />
        </div>
      ) : null}
    </div>
  );
}
