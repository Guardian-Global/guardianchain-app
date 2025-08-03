import { db } from "../../server/db";
import { lineageNodes, lineageEdges } from "../../shared/schema";
import { eq } from "drizzle-orm";

export interface LineageGraphData {
  nodes: Array<{
    id: string;
    title: string;
    x: number;
    y: number;
    createdAt: Date | null;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    createdAt: Date | null;
  }>;
}

export async function getLineageGraph(): Promise<LineageGraphData> {
  try {
    const [nodes, edges] = await Promise.all([
      db.select().from(lineageNodes),
      db.select().from(lineageEdges)
    ]);

    return {
      nodes: nodes.map(node => ({
        id: node.id,
        title: node.title,
        x: parseFloat(node.x || "0"),
        y: parseFloat(node.y || "0"),
        createdAt: node.createdAt
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        createdAt: edge.createdAt
      }))
    };
  } catch (error) {
    console.error("❌ Failed to fetch lineage graph:", error);
    throw error;
  }
}

export async function getCapsuleLineage(capsuleId: string) {
  try {
    // Get ancestors (parents)
    const ancestors = await db
      .select({
        node: lineageNodes,
        edge: lineageEdges
      })
      .from(lineageEdges)
      .innerJoin(lineageNodes, eq(lineageNodes.id, lineageEdges.source))
      .where(eq(lineageEdges.target, capsuleId));

    // Get descendants (children)
    const descendants = await db
      .select({
        node: lineageNodes,
        edge: lineageEdges
      })
      .from(lineageEdges)
      .innerJoin(lineageNodes, eq(lineageNodes.id, lineageEdges.target))
      .where(eq(lineageEdges.source, capsuleId));

    return {
      ancestors: ancestors.map(a => a.node),
      descendants: descendants.map(d => d.node),
      capsuleId
    };
  } catch (error) {
    console.error("❌ Failed to fetch capsule lineage:", error);
    throw error;
  }
}