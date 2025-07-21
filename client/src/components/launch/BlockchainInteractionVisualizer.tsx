import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Zap, Shield, Network, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function BlockchainInteractionVisualizer() {
  const [activeBlock, setActiveBlock] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setActiveBlock((prev) => (prev + 1) % 3);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const blocks = [
    { id: 1, type: "Truth Capsule", color: "bg-green-500", data: "Content Hash: 0x1a2b..." },
    { id: 2, type: "Verification", color: "bg-blue-500", data: "Validator: 0x3c4d..." },
    { id: 3, type: "GTT Reward", color: "bg-purple-500", data: "Amount: 50 GTT" }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-green-500" />
            Blockchain Interaction Visualizer
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? 'Pause' : 'Resume'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Blockchain Flow */}
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {blocks.map((block, index) => (
              <div key={block.id} className="flex items-center">
                <motion.div
                  animate={{
                    scale: activeBlock === index ? 1.1 : 1,
                    opacity: activeBlock === index ? 1 : 0.6
                  }}
                  className={`w-24 h-24 ${block.color} rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold relative`}
                >
                  <div className="text-center">
                    <div className="text-lg">#{block.id}</div>
                    <div className="mt-1">{block.type}</div>
                  </div>
                  
                  {activeBlock === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-slate-300 text-xs whitespace-nowrap"
                    >
                      {block.data}
                    </motion.div>
                  )}
                </motion.div>
                
                {index < blocks.length - 1 && (
                  <motion.div
                    animate={{
                      opacity: activeBlock >= index ? 1 : 0.3,
                      x: activeBlock > index ? 5 : 0
                    }}
                    className="mx-4 flex items-center"
                  >
                    <ArrowRight className="w-6 h-6 text-slate-400" />
                    <div className="ml-2 text-xs text-slate-400">
                      {index === 0 && "Verify"}
                      {index === 1 && "Reward"}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <Activity className="w-8 h-8 text-green-400 mx-auto" />
              <div className="text-2xl font-bold text-green-400">1,247</div>
              <div className="text-sm text-slate-400">Daily Transactions</div>
            </div>
            
            <div className="text-center space-y-2">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto" />
              <div className="text-2xl font-bold text-yellow-400">2.3s</div>
              <div className="text-sm text-slate-400">Avg Block Time</div>
            </div>
            
            <div className="text-center space-y-2">
              <Shield className="w-8 h-8 text-blue-400 mx-auto" />
              <div className="text-2xl font-bold text-blue-400">99.9%</div>
              <div className="text-sm text-slate-400">Validation Rate</div>
            </div>
            
            <div className="text-center space-y-2">
              <Network className="w-8 h-8 text-purple-400 mx-auto" />
              <div className="text-2xl font-bold text-purple-400">5</div>
              <div className="text-sm text-slate-400">Network Nodes</div>
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Truth capsule verified</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400">+25 GTT</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">New validator joined</span>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400">Network</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">GTT rewards distributed</span>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400">Rewards</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}