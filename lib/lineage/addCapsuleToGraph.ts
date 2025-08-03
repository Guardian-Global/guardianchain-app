import { db } from "../../server/db";
import { lineageNodes, lineageEdges } from "../../shared/schema";

export async function addCapsuleToLineage({ capsuleId, title, parentIds = [] }: {
  capsuleId: string,
  title: string,
  parentIds?: string[]
}) {
  try {
    // Add capsule as a node
    await db.insert(lineageNodes).values({
      id: capsuleId,
      title,
      x: (Math.random() * 500).toString(),
      y: (Math.random() * 500).toString(),
    });

    // Link to parent nodes
    for (const parentId of parentIds) {
      await db.insert(lineageEdges).values({
        source: parentId,
        target: capsuleId
      });
    }

    console.log(`✅ Added capsule ${capsuleId} to lineage graph with ${parentIds.length} parent connections`);
  } catch (error) {
    console.error("❌ Lineage system error:", error);
    throw error;
  }
}