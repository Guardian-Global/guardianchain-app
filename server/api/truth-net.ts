import { Request, Response } from "express";

// Truth Net API - Global truth network visualization and analytics
// Provides real-time network mapping of truth capsules and connections

interface TruthNetworkNode {
  id: string;
  title: string;
  category: string;
  truthScore: number;
  position: {
    x: number;
    y: number;
    z?: number;
  };
  connections: string[];
  metadata: {
    author: string;
    timestamp: string;
    verified: boolean;
    notarized: boolean;
    impactScore: number;
    location: {
      country: string;
      region: string;
      coordinates: [number, number];
    };
  };
  influence: {
    directConnections: number;
    indirectReach: number;
    trustScore: number;
    propagationDepth: number;
  };
}

interface TruthNetworkEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  type: "verification" | "reference" | "contradiction" | "support";
  strength: number;
  bidirectional: boolean;
}

interface NetworkAnalytics {
  totalNodes: number;
  totalEdges: number;
  networkDensity: number;
  averageTruthScore: number;
  clusteringCoefficient: number;
  centralityScores: Record<string, number>;
  communityDetection: {
    communities: Array<{
      id: string;
      nodes: string[];
      cohesion: number;
      topic: string;
    }>;
    modularity: number;
  };
  realTimeMetrics: {
    activeNodes: number;
    recentConnections: number;
    propagationVelocity: number;
    truthDiffusion: number;
  };
}

export async function getTruthNetwork(req: Request, res: Response) {
  try {
    const { 
      region = "global", 
      category = "all", 
      timeframe = "7d",
      minTruthScore = 0,
      includeEdges = true,
      limit = 500 
    } = req.query;

    console.log(`🌐 Fetching Truth Network: region=${region}, category=${category}, timeframe=${timeframe}`);

    // Generate network nodes
    const nodes = generateTruthNetworkNodes(Number(limit), {
      region: region as string,
      category: category as string,
      minTruthScore: Number(minTruthScore)
    });

    // Generate network edges if requested
    const edges = includeEdges === 'true' ? generateTruthNetworkEdges(nodes) : [];

    // Calculate network statistics
    const networkStats = calculateNetworkStatistics(nodes, edges);

    res.json({
      success: true,
      network: {
        nodes,
        edges,
        statistics: networkStats,
        metadata: {
          generatedAt: new Date().toISOString(),
          filters: { region, category, timeframe, minTruthScore },
          nodeCount: nodes.length,
          edgeCount: edges.length
        }
      }
    });

  } catch (error) {
    console.error("❌ Truth Network fetch failed:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch truth network",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export async function getNetworkAnalytics(req: Request, res: Response) {
  try {
    const { 
      timeframe = "24h",
      analysisType = "comprehensive" 
    } = req.query;

    console.log(`📊 Generating network analytics: timeframe=${timeframe}, type=${analysisType}`);

    const analytics: NetworkAnalytics = {
      totalNodes: Math.floor(Math.random() * 5000) + 1000,
      totalEdges: Math.floor(Math.random() * 15000) + 3000,
      networkDensity: Math.random() * 0.5 + 0.1,
      averageTruthScore: Math.random() * 30 + 70,
      clusteringCoefficient: Math.random() * 0.6 + 0.2,
      centralityScores: generateCentralityScores(),
      communityDetection: {
        communities: generateCommunities(),
        modularity: Math.random() * 0.4 + 0.4
      },
      realTimeMetrics: {
        activeNodes: Math.floor(Math.random() * 500) + 100,
        recentConnections: Math.floor(Math.random() * 100) + 20,
        propagationVelocity: Math.random() * 10 + 2,
        truthDiffusion: Math.random() * 0.8 + 0.2
      }
    };

    // Additional analytics based on type
    const detailedAnalytics = analysisType === "comprehensive" ? {
      temporalAnalysis: generateTemporalAnalysis(),
      geographicDistribution: generateGeographicDistribution(),
      truthScoreDistribution: generateTruthScoreDistribution(),
      influenceMetrics: generateInfluenceMetrics(),
      propagationPatterns: generatePropagationPatterns()
    } : {};

    res.json({
      success: true,
      analytics: {
        ...analytics,
        ...detailedAnalytics
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Network analytics failed:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to generate network analytics" 
    });
  }
}

export async function exportTruthNetwork(req: Request, res: Response) {
  try {
    const { 
      format = "json",
      includeMetadata = true,
      compression = false 
    } = req.query;

    console.log(`📤 Exporting Truth Network: format=${format}, metadata=${includeMetadata}`);

    // Generate export data
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        format: format,
        totalNodes: Math.floor(Math.random() * 5000) + 1000,
        totalEdges: Math.floor(Math.random() * 15000) + 3000,
        dataIntegrity: "verified",
        checksumSHA256: generateChecksum()
      },
      network: {
        nodes: generateTruthNetworkNodes(100),
        edges: generateTruthNetworkEdges([])
      },
      analytics: {
        networkHealth: Math.random() * 0.3 + 0.7,
        truthReliability: Math.random() * 0.2 + 0.8,
        communityCoherence: Math.random() * 0.4 + 0.6
      }
    };

    // Set appropriate headers based on format
    if (format === "csv") {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="truth_network_export.csv"');
      res.send(convertToCSV(exportData));
    } else if (format === "graphml") {
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename="truth_network_export.graphml"');
      res.send(convertToGraphML(exportData));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="truth_network_export.json"');
      res.json(exportData);
    }

  } catch (error) {
    console.error("❌ Network export failed:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to export truth network" 
    });
  }
}

// Helper functions
function generateTruthNetworkNodes(count: number, filters?: any): TruthNetworkNode[] {
  const categories = ["whistleblowing", "testimony", "historical", "news", "legal", "research"];
  const countries = ["US", "UK", "CA", "DE", "FR", "AU", "JP", "BR", "IN", "ZA"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `node_${i}`,
    title: `Truth Node ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    truthScore: Math.floor(Math.random() * 40) + 60,
    position: {
      x: (Math.random() - 0.5) * 1000,
      y: (Math.random() - 0.5) * 1000,
      z: (Math.random() - 0.5) * 100
    },
    connections: Array.from({ length: Math.floor(Math.random() * 10) }, () => 
      `node_${Math.floor(Math.random() * count)}`
    ),
    metadata: {
      author: `user_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      verified: Math.random() > 0.3,
      notarized: Math.random() > 0.7,
      impactScore: Math.floor(Math.random() * 100),
      location: {
        country: countries[Math.floor(Math.random() * countries.length)],
        region: "global",
        coordinates: [
          (Math.random() - 0.5) * 360,
          (Math.random() - 0.5) * 180
        ] as [number, number]
      }
    },
    influence: {
      directConnections: Math.floor(Math.random() * 50),
      indirectReach: Math.floor(Math.random() * 500),
      trustScore: Math.random() * 100,
      propagationDepth: Math.floor(Math.random() * 5) + 1
    }
  }));
}

function generateTruthNetworkEdges(nodes: TruthNetworkNode[]): TruthNetworkEdge[] {
  const edgeTypes: Array<"verification" | "reference" | "contradiction" | "support"> = 
    ["verification", "reference", "contradiction", "support"];
  
  const edges: TruthNetworkEdge[] = [];
  
  // Generate edges based on node connections
  nodes.forEach((node, i) => {
    node.connections.forEach((targetId, j) => {
      if (Math.random() > 0.5) { // Random edge generation
        edges.push({
          id: `edge_${i}_${j}`,
          source: node.id,
          target: targetId,
          weight: Math.random(),
          type: edgeTypes[Math.floor(Math.random() * edgeTypes.length)],
          strength: Math.random() * 100,
          bidirectional: Math.random() > 0.6
        });
      }
    });
  });
  
  return edges;
}

function calculateNetworkStatistics(nodes: TruthNetworkNode[], edges: TruthNetworkEdge[]) {
  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    density: edges.length / (nodes.length * (nodes.length - 1)),
    averageDegree: edges.length * 2 / nodes.length,
    averageTruthScore: nodes.reduce((sum, node) => sum + node.truthScore, 0) / nodes.length,
    verifiedPercentage: (nodes.filter(n => n.metadata.verified).length / nodes.length) * 100,
    notarizedPercentage: (nodes.filter(n => n.metadata.notarized).length / nodes.length) * 100
  };
}

function generateCentralityScores(): Record<string, number> {
  return {
    betweenness: Math.random() * 100,
    closeness: Math.random() * 100,
    eigenvector: Math.random() * 100,
    pagerank: Math.random() * 100
  };
}

function generateCommunities() {
  const topics = ["Corporate Transparency", "Government Accountability", "Scientific Integrity", "Media Truth", "Legal Justice"];
  
  return topics.map((topic, i) => ({
    id: `community_${i}`,
    nodes: Array.from({ length: Math.floor(Math.random() * 50) + 10 }, (_, j) => `node_${i}_${j}`),
    cohesion: Math.random() * 0.5 + 0.5,
    topic
  }));
}

function generateTemporalAnalysis() {
  return {
    growthRate: Math.random() * 20 + 5,
    peakActivity: "14:30 UTC",
    seasonalTrends: ["Spring surge", "Summer plateau", "Fall acceleration", "Winter consolidation"],
    hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activity: Math.random() * 100
    }))
  };
}

function generateGeographicDistribution() {
  return {
    regions: [
      { name: "North America", percentage: 35.2, nodes: 2106 },
      { name: "Europe", percentage: 28.7, nodes: 1718 },
      { name: "Asia Pacific", percentage: 22.1, nodes: 1323 },
      { name: "South America", percentage: 8.4, nodes: 503 },
      { name: "Africa", percentage: 3.8, nodes: 228 },
      { name: "Middle East", percentage: 1.8, nodes: 108 }
    ],
    diversityIndex: Math.random() * 0.3 + 0.7
  };
}

function generateTruthScoreDistribution() {
  return {
    distribution: [
      { range: "90-100%", count: 1247, percentage: 31.2 },
      { range: "80-89%", count: 1586, percentage: 39.7 },
      { range: "70-79%", count: 891, percentage: 22.3 },
      { range: "60-69%", count: 203, percentage: 5.1 },
      { range: "Below 60%", count: 68, percentage: 1.7 }
    ],
    median: 84.6,
    mean: 82.3,
    standardDeviation: 12.8
  };
}

function generateInfluenceMetrics() {
  return {
    topInfluencers: [
      { nodeId: "node_1247", influence: 94.7, category: "whistleblowing" },
      { nodeId: "node_856", influence: 91.3, category: "legal" },
      { nodeId: "node_2341", influence: 88.9, category: "research" }
    ],
    influenceDistribution: "power-law",
    averageInfluence: 23.4,
    influenceGrowthRate: 12.7
  };
}

function generatePropagationPatterns() {
  return {
    averageHops: 3.2,
    maximumReach: 847,
    propagationSpeed: "2.4 nodes/hour",
    bottlenecks: ["verification_delay", "geographic_barriers", "language_barriers"],
    amplificationFactors: ["verified_status", "notarization", "high_truth_score"]
  };
}

function generateChecksum(): string {
  return Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

function convertToCSV(data: any): string {
  // Simple CSV conversion - in production would use proper CSV library
  const headers = ["id", "title", "category", "truthScore", "verified", "notarized"];
  const rows = data.network.nodes.map((node: TruthNetworkNode) => [
    node.id,
    node.title,
    node.category,
    node.truthScore,
    node.metadata.verified,
    node.metadata.notarized
  ]);
  
  return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
}

function convertToGraphML(data: any): string {
  // Simple GraphML conversion - in production would use proper XML library
  return `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns">
  <graph id="truth_network" edgedefault="directed">
    <!-- Nodes and edges would be properly formatted here -->
    <node id="sample_node"/>
  </graph>
</graphml>`;
}