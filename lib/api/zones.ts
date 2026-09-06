import type { ParkingZone } from "@/lib/zones";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchZone(qrId: string) {
  const response = await fetch(`${API_URL}/public/zones/${qrId}`);
  const data = (await response.json()) as ParkingZone & { detail?: string };

  if (!response.ok) {
    throw new Error(data.detail ?? "Unable to load zone.");
  }

  return data;
}
