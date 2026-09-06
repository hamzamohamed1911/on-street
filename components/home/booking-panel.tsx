import { BookingSteps } from "@/components/home/booking-steps";
import { fetchZone } from "@/lib/api/zones";

type BookingPanelProps = {
  qrId: string;
};

export async function BookingPanel({ qrId }: BookingPanelProps) {
  let zone = null;
  let zoneError: string | null = null;

  try {
    zone = await fetchZone(qrId);
  } catch (error) {
    zoneError =
      error instanceof Error ? error.message : "Unable to load zone.";
  }

  return <BookingSteps zone={zone} zoneError={zoneError} />;
}
