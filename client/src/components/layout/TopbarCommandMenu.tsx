// components/layout/TopbarCommandMenu.tsx — Command palette and quick actions
import { useState } from "react";
import { Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLocation } from "wouter";

interface TopbarCommandMenuProps {
  tier: string;
}

export default function TopbarCommandMenu({ tier }: TopbarCommandMenuProps) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  const commands = [
    {
      group: "Navigation",
      items: [
        { label: "Dashboard", value: "/dashboard", icon: "🏠" },
        { label: "Create Capsule", value: "/capsules/create", icon: "✨" },
        { label: "Vault", value: "/vault", icon: "🏛️" },
        { label: "GTT Demo", value: "/gtt-demo", icon: "💎" },
        { label: "Analytics", value: "/analytics", icon: "📊" },
      ]
    },
    {
      group: "Tools",
      items: [
        { label: "Veritas Tools", value: "/veritas", icon: "⚖️" },
        { label: "DAO Governance", value: "/dao", icon: "🗳️" },
        { label: "Validator Dashboard", value: "/validator", icon: "🛡️" },
        { label: "Press Kit", value: "/press-kit", icon: "📰" },
      ]
    },
    {
      group: "Account",
      items: [
        { label: "Profile", value: "/profile", icon: "👤" },
        { label: "Settings", value: "/settings", icon: "⚙️" },
        { label: "Legal", value: "/legal", icon: "📜" },
      ]
    }
  ];

  const handleSelect = (value: string) => {
    setLocation(value);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="relative h-8 w-8 p-0 xl:h-8 xl:w-40 xl:justify-start xl:px-3 xl:py-2 bg-brand-surface/50 border-brand-surface hover:bg-brand-surface text-brand-light hover:text-brand-primary"
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search commands...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border border-brand-surface/50 bg-brand-secondary px-1.5 font-mono text-[10px] font-medium text-brand-light/60 xl:flex">
          <Command className="h-3 w-3" />K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Type a command or search..." 
          className="bg-brand-secondary text-brand-light"
        />
        <CommandList className="bg-brand-secondary">
          <CommandEmpty className="text-brand-light/60">
            No results found.
          </CommandEmpty>
          {commands.map((group) => (
            <CommandGroup 
              key={group.group} 
              heading={group.group}
              className="text-brand-light"
            >
              {group.items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => handleSelect(item.value)}
                  className="text-brand-light hover:bg-brand-surface cursor-pointer"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}