import type { ParkingZone } from "@/lib/zones";
import { BookingInput } from "../schemas/booking.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchZone(qrId: string) {
  const response = await fetch(`${API_URL}/public/zones/${qrId}`, {
    cache: "no-store",
  });
  const data = (await response.json()) as ParkingZone & { detail?: string };

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}
type BookingQuoteResponse = {
  id?: number;
  total?: number;
  detail?: string;
  [key: string]: unknown;
};
export async function submitBooking(
  bookingBody: BookingInput,
): Promise<BookingQuoteResponse> {
  const response = await fetch(`${API_URL}/api/public/bookings/quote/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingBody),
  });
  const data = (await response.json()) as BookingQuoteResponse;
  if (!response.ok) {
    throw new Error(data.detail || "Failed to submit booking");
  }
  return data;
}
