import { Skeleton } from "@/components/ui/skeleton";

export function ZoneCardSkeleton() {
  return (
    <div className="relative flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-2/3" />
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="mt-2 h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}
