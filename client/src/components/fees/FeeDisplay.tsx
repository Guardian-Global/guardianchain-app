import { useState } from 'react';
import { Info, DollarSign, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatGTTAmount, getFeeUSDEstimate, getFeeJustification, hasSufficientBalance, type FeeAction } from '@/lib/feeConfig';

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
  className = ""
}: FeeDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const gttAmount = formatGTTAmount(feeAmount);
  const usdEstimate = getFeeUSDEstimate(action);
  const justification = getFeeJustification(action);
  const hasSufficientFunds = userBalance ? hasSufficientBalance(userBalance, feeAmount) : true;

  return (
    <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            <span className="text-white">{justification.title}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-slate-400 hover:text-white"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click for fee details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fee Amount */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Protocol Fee:</span>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-600 text-white">
              {gttAmount} GTT
            </Badge>
            <span className="text-sm text-slate-400">
              (~${usdEstimate.toFixed(2)})
            </span>
          </div>
        </div>

        {/* User Balance Check */}
        {userBalance && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Your Balance:</span>
            <div className="flex items-center gap-2">
              <span className="text-white">{formatGTTAmount(userBalance)} GTT</span>
              <Badge variant={hasSufficientFunds ? "default" : "destructive"}>
                {hasSufficientFunds ? "Sufficient" : "Insufficient"}
              </Badge>
            </div>
          </div>
        )}

        {/* Fee Details */}
        {showDetails && (
          <div className="border-t border-slate-600 pt-4 space-y-3">
            <div>
              <h4 className="font-semibold text-white mb-2">Why this fee?</h4>
              <p className="text-sm text-slate-300">{justification.description}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Benefits:</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                {justification.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-400">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Insufficient Balance Warning */}
        {userBalance && !hasSufficientFunds && (
          <Alert className="border-red-700 bg-red-900/20">
            <AlertDescription className="text-red-400">
              You need {gttAmount} GTT to pay this fee. Current balance: {formatGTTAmount(userBalance)} GTT
            </AlertDescription>
          </Alert>
        )}

        {/* Pay Fee Button */}
        {onPayFee && (
          <Button
            onClick={onPayFee}
            disabled={isPaying || (userBalance && !hasSufficientFunds)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isPaying ? (
              <>
                <Coins className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Pay {gttAmount} GTT Fee
              </>
            )}
          </Button>
        )}

        {/* Fee goes to treasury note */}
        <div className="text-xs text-slate-500 text-center">
          Fees support platform development and community rewards
        </div>
      </CardContent>
    </Card>
  );
}