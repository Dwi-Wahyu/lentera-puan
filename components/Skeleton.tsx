export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-outline-variant/20 ${className}`}
    />
  );
}
