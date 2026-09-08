import { BookingSteps } from "@/components/home/booking-steps";
import { fetchZone } from "@/lib/api/zones";
import { BookingSummary } from "./booking-summary";

type BookingPanelProps = {
  qrId: string;
};

export async function BookingPanel({ qrId }: BookingPanelProps) {
  let zone = null;
  let zoneError: string | null = null;

  try {
    zone = await fetchZone(qrId);
  } catch (error) {
    zoneError = error instanceof Error ? error.message : "Unable to load zone.";
  }

  return (
  <>
    <section className="rounded-2xl bg-card p-5 text-start text-card-foreground shadow-lg sm:p-6">
      <BookingSteps zone={zone} zoneError={zoneError} />
    </section>
      <BookingSummary />
  </>
  );
}
