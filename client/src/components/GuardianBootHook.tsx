import { useEffect, useState } from "react";
import { useCapsules, useRecentCapsule } from "../hooks/useCapsules";
import { useReels } from "../hooks/useReels";
import { useAuth } from "../hooks/useAuth";
import { useUserStats } from "../hooks/useUserStats";

/**
 * GuardianBootHook - Dynamic Capsule Loading System
 * Maps all loaded threads and provides centralized state management
 */
export function GuardianBootHook() {
  const [bootStatus, setBootStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [threadMap, setThreadMap] = useState<Map<string, any>>(new Map());

  const { user, isAuthenticated } = useAuth();
  const { data: capsules = [], isLoading: capsulesLoading } = useCapsules();
  const { data: recentCapsule = {} } = useRecentCapsule();
  const { data: reels = [] } = useReels(); 
  const { data: userStats } = useUserStats();

  // Dynamic thread mapping with dependency array fix
  useEffect(() => {
    if (capsulesLoading) return;

    const newThreadMap = new Map();

    // Map capsule threads
    if (Array.isArray(capsules)) {
      capsules.forEach((capsule: any) => {
        newThreadMap.set(`capsule-${capsule.id}`, {
          type: "capsule",
          id: capsule.id,
          status: "loaded",
          data: capsule,
          connections: getConnectedThreads(capsule),
        });
      });
    }

    // Map reel threads
    if (Array.isArray(reels)) {
      reels.forEach((reel: any) => {
        newThreadMap.set(`reel-${reel.id}`, {
          type: "reel",
          id: reel.id,
          status: "loaded",
          data: reel,
          connections:
            reel.capsuleIds?.map((id: string) => `capsule-${id}`) || [],
        });
      });
    }

    // Map user stat threads
    if (userStats) {
      newThreadMap.set("user-stats", {
        type: "stats",
        id: "user-stats",
        status: "loaded",
        data: userStats,
        connections: [],
      });
    }

    // Map recent capsule thread
    if (recentCapsule && recentCapsule.id) {
      newThreadMap.set("recent-capsule", {
        type: "recent",
        id: "recent-capsule",
        status: "loaded",
        data: recentCapsule,
        connections: [`capsule-${recentCapsule.id}`],
      });
    }

    setThreadMap(newThreadMap);
    setBootStatus("ready");
  }, [capsules, reels, userStats, recentCapsule, capsulesLoading]);

  // Get connected threads for a capsule
  const getConnectedThreads = (capsule: any) => {
    const connections = [];

    // Add lineage connections
    if (capsule.parentId) {
      connections.push(`capsule-${capsule.parentId}`);
    }

    // Add category connections
    if (capsule.type) {
      connections.push(`category-${capsule.type}`);
    }

    // Add user connections
    if (capsule.userId) {
      connections.push(`user-${capsule.userId}`);
    }

    return connections;
  };

  // Provide thread map to global context
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).guardianThreadMap = threadMap;
      (window as any).guardianBootStatus = bootStatus;
    }
  }, [threadMap, bootStatus]);

  // Boot sequence logging
  useEffect(() => {
    console.log("🔮 GuardianBootHook Status:", {
      status: bootStatus,
      threadsLoaded: threadMap.size,
      isAuthenticated,
      user: user?.id,
    });
  }, [bootStatus, threadMap.size, isAuthenticated, user]);

  return null; // This is a hook component, no UI
}

/**
 * Thread Access Hook
 * Provides access to the mapped thread data
 */
export function useThreadMap() {
  const [threadMap, setThreadMap] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateThreadMap = () => {
        const map = (window as any).guardianThreadMap;
        if (map instanceof Map) {
          setThreadMap(new Map(map));
        }
      };

      updateThreadMap();

      // Listen for updates
      const interval = setInterval(updateThreadMap, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return {
    threadMap,
    getThread: (id: string) => threadMap.get(id),
    getAllThreads: () => Array.from(threadMap.values()),
    getThreadsByType: (type: string) =>
      Array.from(threadMap.values()).filter((thread) => thread.type === type),
  };
}

export default GuardianBootHook;
