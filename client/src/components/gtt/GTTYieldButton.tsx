import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { triggerGTTYield } from "@/lib/gtt";
import { Coins, Loader2 } from "lucide-react";

interface GTTYieldButtonProps {
  authorAddress: string;
  griefTier: number;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export function GTTYieldButton({ 
  authorAddress, 
  griefTier, 
  disabled = false,
  className = "",
  variant = "default",
  size = "default"
}: GTTYieldButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleYieldDistribution = async () => {
    if (!authorAddress || griefTier < 1 || griefTier > 5) {
      toast({
        title: "Invalid Parameters",
        description: "Author address and grief tier (1-5) are required.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Triggering GTT yield distribution:', { authorAddress, griefTier });
      
      const transactionHash = await triggerGTTYield(authorAddress, griefTier);
      
      toast({
        title: "GTT Yield Distributed!",
        description: `${griefTier * 10} GTT distributed to author. Transaction: ${transactionHash.slice(0, 10)}...`
      });
      
    } catch (error) {
      console.error('❌ GTT yield distribution failed:', error);
      toast({
        title: "Distribution Failed",
        description: "Unable to distribute GTT yield. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleYieldDistribution}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Coins className="h-4 w-4 mr-2" />
      )}
      {isLoading ? "Distributing..." : `Distribute ${griefTier * 10} GTT`}
    </Button>
  );
}