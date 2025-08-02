// Simple Badge component for the new pages
export function Badge({ children, variant = "default", className = "", ...props }: any) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  const variantClasses = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    outline: "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
  };
  
  return (
    <span 
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}