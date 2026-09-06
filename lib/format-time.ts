export function isAllDay(startTime: string, endTime: string) {
  return startTime.startsWith("00:00") && endTime.startsWith("23:59");
}

export function formatClockTime(time: string) {
  const [hours] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${String(hour12).padStart(2, "0")} ${suffix}`;
}

export function formatHourlyRate(rate: number) {
  return rate.toFixed(2);
}
