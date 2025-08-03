import { motion } from "framer-motion";

export default function AnimatedLaunchHero() {
  return (
    <div className="relative overflow-hidden bg-black text-white h-screen flex items-center justify-center">
      <motion.video
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-full h-full object-cover opacity-30"
        src="/assets/video/guardian-launch-hero.mp4"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold">The Truth Has Arrived.</h1>
        <p className="text-lg mt-4">GuardianChain v1.0 is now live — preserve it forever.</p>
      </motion.div>
    </div>
  );
}
