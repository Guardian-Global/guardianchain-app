import { db } from "../../server/db";
import { clusterVotes } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

export async function voteOnClusterTheme({ clusterId, userId, theme }: {
  clusterId: number;
  userId: string;
  theme: string;
}) {
  try {
    // Check for existing vote
    const existingVote = await db
      .select()
      .from(clusterVotes)
      .where(
        and(
          eq(clusterVotes.clusterId, clusterId),
          eq(clusterVotes.userId, userId)
        )
      )
      .limit(1);

    if (existingVote.length > 0) {
      // Update existing vote
      await db
        .update(clusterVotes)
        .set({
          theme,
          votedAt: new Date()
        })
        .where(
          and(
            eq(clusterVotes.clusterId, clusterId),
            eq(clusterVotes.userId, userId)
          )
        );
    } else {
      // Insert new vote
      await db.insert(clusterVotes).values({
        clusterId,
        userId,
        theme,
        votedAt: new Date()
      });
    }

    console.log(`✅ User ${userId} voted "${theme}" for cluster ${clusterId}`);
    return true;
  } catch (error) {
    console.error("❌ Theme vote error:", error);
    return false;
  }
}

export async function getClusterVotes(clusterId: number) {
  try {
    const votes = await db
      .select()
      .from(clusterVotes)
      .where(eq(clusterVotes.clusterId, clusterId));

    // Count votes by theme
    const themeVotes: Record<string, number> = {};
    votes.forEach(vote => {
      themeVotes[vote.theme] = (themeVotes[vote.theme] || 0) + 1;
    });

    return {
      totalVotes: votes.length,
      themeVotes,
      topTheme: Object.entries(themeVotes).sort(([,a], [,b]) => b - a)[0]?.[0] || null
    };
  } catch (error) {
    console.error("❌ Failed to get cluster votes:", error);
    return { totalVotes: 0, themeVotes: {}, topTheme: null };
  }
}