import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CapsuleSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function CapsuleSearch({
  onSearch,
  placeholder = "Search capsules by title, author, or content...",
}: CapsuleSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <Button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
      >
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
