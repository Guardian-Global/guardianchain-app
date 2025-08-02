import { motion } from "framer-motion";
import { GitBranch, Workflow, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TruthPipeline() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-2xl mb-6">
            <GitBranch className="w-8 h-8 text-black" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Truth Processing Pipeline
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Automated workflow system for truth capsule processing, verification routing, and quality assurance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-[#FFD700]">
                <Workflow className="w-6 h-6 mr-3" />
                Processing Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mb-6 mx-auto">
                <Zap className="w-10 h-10 text-cyan-400" />
              </div>
              
              <h3 className="text-2xl font-semibold text-white mb-4">
                Automated Truth Processing
              </h3>
              
              <p className="text-slate-400 mb-6 leading-relaxed">
                The Truth Pipeline will provide automated routing of capsules through 
                verification stages, quality control checkpoints, and validation workflows. 
                AI-powered preprocessing, automated validator assignment, and real-time 
                processing status tracking will ensure efficient truth verification at scale.
              </p>
              
              <div className="text-sm text-slate-500">
                🚧 Stay tuned for GuardianChain's next truth module
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}