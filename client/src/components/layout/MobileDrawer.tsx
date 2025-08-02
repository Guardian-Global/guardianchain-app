// components/layout/MobileDrawer.tsx — Mobile navigation drawer
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

interface MobileDrawerProps {
  tier: string;
}

export default function MobileDrawer({ tier }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-brand-light hover:text-brand-primary"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 bg-brand-secondary border-brand-surface">
          <div className="flex items-center justify-between p-4 border-b border-brand-surface">
            <h2 className="text-lg font-semibold text-brand-light font-brand">
              GuardianChain
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setOpen(false)}
              className="text-brand-light hover:text-brand-primary"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="overflow-y-auto">
            <Sidebar userTier={tier} mobile onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}