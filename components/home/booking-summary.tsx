import { useTranslations } from "next-intl";
import { UseFormReturn, useWatch } from "react-hook-form";

import { BookingInput } from "@/lib/schemas/booking.schema";
import { ParkingZone } from "@/lib/zones";
import { formatDateTime } from "@/lib/utils/formatDateTime";

type BookingSummaryProps = {
  form: UseFormReturn<BookingInput>;
  zone: ParkingZone | null;
};

export function BookingSummary({
  form,
  zone,
}: BookingSummaryProps) {
  const t = useTranslations("HomePage");

  const values = useWatch({
    control: form.control,
  });

  const hours = values.hours || 1;

  const hourlyRate = Number(zone?.hourly_rate ?? 0);
  const additionalFee = Number(zone?.additional_fee ?? 0);

  const subtotal = hourlyRate * hours;
  const total = subtotal + additionalFee;

  const currency = zone?.currency || "SAR";

  const startDate = new Date();

  const endDate = new Date(
    startDate.getTime() + hours * 60 * 60 * 1000,
  );

  return (
    <aside className="rounded-2xl bg-card p-5 text-start text-card-foreground shadow-lg sm:p-6 lg:sticky lg:top-24">
      {/* Header */}
      <h2 className="text-sm font-extrabold text-foreground">
        {t("summaryTitle")}
      </h2>

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {t("summaryDescription")}
      </p>

      <div className="mt-5 space-y-5">
        {/* Zone */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">
            {zone?.site_name || "-"}
          </h3>

          <p className="mt-1 text-sm font-semibold text-foreground">
            {zone?.name || "-"}
          </p>
        </div>

        {/* Selected Time */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-foreground">
            Selected time
          </h3>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Duration
              </span>

              <span className="text-sm font-semibold">
                {hours} {hours === 1 ? "hour" : "hours"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                From {formatDateTime(startDate)}
              </p>

              <p className="text-sm text-muted-foreground">
                To {formatDateTime(endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Cost */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-foreground">
            Cost
          </h3>

          <div className="mt-3 space-y-2">
            {/* Hourly Rate */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Hourly rate
              </span>

              <span className="font-medium">
                {hourlyRate.toFixed(2)} {currency}
              </span>
            </div>

            {/* Duration Cost */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {hours} {hours === 1 ? "hour" : "hours"}
              </span>

              <span className="font-medium">
                {subtotal.toFixed(2)} {currency}
              </span>
            </div>

            {/* Additional Fee */}
            {additionalFee > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Additional fee
                </span>

                <span className="font-medium">
                  {additionalFee.toFixed(2)} {currency}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between border-t pt-3">
              <span className="font-bold text-foreground">
                Total
              </span>

              <span className="text-lg font-extrabold text-foreground">
                {total.toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}