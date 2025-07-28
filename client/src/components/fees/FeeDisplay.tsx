import { useState } from "react";
import { Info, DollarSign, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  formatGTTAmount,
  getFeeUSDEstimate,
  getFeeJustification,
  hasSufficientBalance,
  type FeeAction,
} from "@/lib/feeConfig";

interface FeeDisplayProps {
  action: FeeAction;
  feeAmount: string;
  userBalance?: string;
  onPayFee?: () => void;
  isPaying?: boolean;
  className?: string;
}

export default function FeeDisplay({
  action,
  feeAmount,
  userBalance,
  onPayFee,
  isPaying = false,
  className = "",
}: FeeDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  const gttAmount = formatGTTAmount(feeAmount);
  const usdEstimate = getFeeUSDEstimate(action);
  const justification = getFeeJustification(action);
  const hasSufficientFunds = userBalance
    ? hasSufficientBalance(userBalance, feeAmount)
    : true;

  return (
    <Card
      className={`bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-yellow-500/30 shadow-lg shadow-yellow-500/10 ${className}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Coins className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <span className="text-white text-lg font-bold">
                {justification.title}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-yellow-600 text-white text-lg font-bold px-3 py-1">
                  {gttAmount} GTT
                </Badge>
                <span className="text-sm text-slate-400">
                  (~${usdEstimate.toFixed(2)} USD)
                </span>
              </div>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  <Info className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click for fee breakdown</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Balance Check */}
        {userBalance && (
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <span className="text-slate-300 font-medium">
              Your GTT Balance:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">
                {formatGTTAmount(userBalance)} GTT
              </span>
              <Badge
                variant={hasSufficientFunds ? "default" : "destructive"}
                className="ml-2"
              >
                {hasSufficientFunds ? "✓ Sufficient" : "⚠ Insufficient"}
              </Badge>
            </div>
          </div>
        )}

        {/* Fee Details */}
        {showDetails && (
          <div className="border-t border-slate-600 pt-4 space-y-4">
            <div className="bg-slate-700/20 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-400" />
                Why this fee exists
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {justification.description}
              </p>
            </div>

            <div className="bg-slate-700/20 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                Platform Benefits
              </h4>
              <ul className="text-sm text-slate-300 space-y-2">
                {justification.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Insufficient Balance Warning */}
        {userBalance && !hasSufficientFunds && (
          <Alert className="border-red-600/50 bg-red-900/20">
            <AlertDescription className="text-red-300 font-medium">
              ⚠ Insufficient Balance: You need {gttAmount} GTT to proceed.
              Current balance: {formatGTTAmount(userBalance)} GTT
            </AlertDescription>
          </Alert>
        )}

        {/* Pay Fee Button */}
        {onPayFee && (
          <Button
            onClick={onPayFee}
            disabled={isPaying || (userBalance && !hasSufficientFunds)}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white font-bold py-3 text-lg shadow-lg"
          >
            {isPaying ? (
              <>
                <Coins className="mr-2 h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-5 w-5" />
                Pay {gttAmount} GTT Fee
              </>
            )}
          </Button>
        )}

        {/* Fee Treasury Note */}
        <div className="text-center p-3 bg-slate-700/20 rounded-lg">
          <p className="text-xs text-slate-400 leading-relaxed">
            💰 All fees support GuardianChain ecosystem development
            <br />
            🏛️ Funds are managed transparently by the DAO treasury
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
