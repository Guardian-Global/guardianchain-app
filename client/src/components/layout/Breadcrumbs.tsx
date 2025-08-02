import { useLocation } from "wouter";
import { ROUTES } from "@/lib/routes";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const [location] = useLocation();
  const match = ROUTES.find((r) => r.path === location);

  if (!match || location === "/") return null;

  return (
    <div className="flex items-center gap-2 px-6 py-3 text-sm text-gray-600 border-b border-gray-100">
      <Home className="w-4 h-4 text-gray-400" />
      <span className="text-gray-400">Dashboard</span>
      <ChevronRight className="w-4 h-4 text-gray-300" />
      <span className="font-medium text-gray-700">
        {match.label.replace(/^[^a-zA-Z]+/, "")}
      </span>
    </div>
  );
}