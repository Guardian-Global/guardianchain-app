// Simple Progress component for the new pages
export function Progress({ value = 0, className = "", ...props }: any) {
  return (
    <div
      className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-blue-600 transition-all duration-300 ease-in-out"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
}
