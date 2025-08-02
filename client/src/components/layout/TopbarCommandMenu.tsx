import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ROUTES } from "@/lib/routes";
import { Search, Command } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function TopbarCommandMenu() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const tier = user?.tier?.toLowerCase() || "guest";
  
  const results = ROUTES.filter(
    (r) => r.roles.includes(tier) && 
    (r.label.toLowerCase().includes(query.toLowerCase()) ||
     r.description.toLowerCase().includes(query.toLowerCase()) ||
     r.path.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search routes...</span>
        <div className="flex items-center gap-1 ml-auto">
          <kbd className="px-1.5 py-0.5 text-xs bg-white border rounded">⌘</kbd>
          <kbd className="px-1.5 py-0.5 text-xs bg-white border rounded">K</kbd>
        </div>
      </button>

      {/* Command Palette Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[10vh]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center gap-3 p-4 border-b">
              <Command className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for features, pages, or tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 outline-none text-lg"
                autoFocus
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ESC
              </button>
            </div>
            
            {query && (
              <div className="max-h-80 overflow-y-auto">
                {results.length > 0 ? (
                  <ul className="py-2">
                    {results.map((route) => (
                      <li key={route.path}>
                        <Link href={route.path}>
                          <a 
                            onClick={handleResultClick}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                              <span className="text-blue-600 text-sm font-medium">
                                {route.label.match(/^[^a-zA-Z]*(.)/)?.[1]?.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {route.label}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {route.description}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {route.path}
                              </div>
                            </div>
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <Search className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                    <p>No routes found for "{query}"</p>
                    <p className="text-sm mt-1">Try searching for features, pages, or tools</p>
                  </div>
                )}
              </div>
            )}
            
            {!query && (
              <div className="py-6 px-4 text-center text-gray-500">
                <Command className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p className="font-medium mb-1">Quick Navigation</p>
                <p className="text-sm">Type to search for any platform feature or page</p>
                <div className="mt-4 text-xs text-gray-400">
                  <p>You have access to {ROUTES.filter(r => r.roles.includes(tier)).length} routes as a {tier} user</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}