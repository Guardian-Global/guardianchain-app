import { Request, Response } from "express";

// Truth Net Visualization API
// Provides global network visualization of truth memory connections

interface TruthNode {
  id: string;
  title: string;
  category: string;
  emotion: string;
  truthScore: number;
  location: { 
    lat: number; 
    lng: number; 
    country: string;
    region: string;
  };
  connections: string[];
  timestamp: string;
  author: string;
  verified: boolean;
  influence: number;
  resonance: number;
  lineageDepth: number;
  tags: string[];
  capsuleType: "text" | "image" | "video" | "audio" | "document";
}

interface TruthNetworkStats {
  totalNodes: number;
  verifiedNodes: number;
  avgTruthScore: number;
  strongestConnections: Array<{
    from: string;
    to: string;
    strength: number;
  }>;
  emotionalDistribution: Record<string, number>;
  geographicalHotspots: Array<{
    region: string;
    nodeCount: number;
    avgTruthScore: number;
  }>;
}

// Generate mock truth network data (replace with actual database queries)
function generateTruthNetwork(): TruthNode[] {
  const emotions = ["Grief", "Hope", "Anger", "Fear", "Joy", "Concern", "Reverence"];
  const categories = ["Environmental", "Investigation", "Personal", "Historical", "Technology", "Social"];
  const countries = [
    { name: "USA", lat: 39.8283, lng: -98.5795 },
    { name: "UK", lat: 55.3781, lng: -3.4360 },
    { name: "Japan", lat: 36.2048, lng: 138.2529 },
    { name: "Germany", lat: 51.1657, lng: 10.4515 },
    { name: "Australia", lat: -25.2744, lng: 133.7751 },
    { name: "Canada", lat: 56.1304, lng: -106.3468 },
    { name: "France", lat: 46.2276, lng: 2.2137 },
    { name: "Brazil", lat: -14.2350, lng: -51.9253 }
  ];

  const nodes: TruthNode[] = [];
  
  for (let i = 0; i < 50; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const nodeId = `node_${i.toString().padStart(3, '0')}`;
    
    nodes.push({
      id: nodeId,
      title: `Truth Capsule ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      truthScore: Math.floor(Math.random() * 30) + 70, // 70-100
      location: {
        lat: country.lat + (Math.random() - 0.5) * 10,
        lng: country.lng + (Math.random() - 0.5) * 10,
        country: country.name,
        region: country.name
      },
      connections: [], // Will be populated after all nodes are created
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      author: `Author ${i + 1}`,
      verified: Math.random() > 0.3,
      influence: Math.random(),
      resonance: Math.random(),
      lineageDepth: Math.floor(Math.random() * 5) + 1,
      tags: [`tag${Math.floor(Math.random() * 10) + 1}`],
      capsuleType: ["text", "image", "video", "audio", "document"][Math.floor(Math.random() * 5)] as any
    });
  }

  // Generate connections between nodes
  nodes.forEach(node => {
    const connectionCount = Math.floor(Math.random() * 4) + 1;
    const possibleConnections = nodes.filter(n => n.id !== node.id);
    
    for (let i = 0; i < connectionCount && i < possibleConnections.length; i++) {
      const randomConnection = possibleConnections[Math.floor(Math.random() * possibleConnections.length)];
      if (!node.connections.includes(randomConnection.id)) {
        node.connections.push(randomConnection.id);
      }
    }
  });

  return nodes;
}

function calculateNetworkStats(nodes: TruthNode[]): TruthNetworkStats {
  const verifiedNodes = nodes.filter(n => n.verified);
  const avgTruthScore = nodes.reduce((sum, n) => sum + n.truthScore, 0) / nodes.length;
  
  // Calculate emotional distribution
  const emotionalDistribution: Record<string, number> = {};
  nodes.forEach(node => {
    emotionalDistribution[node.emotion] = (emotionalDistribution[node.emotion] || 0) + 1;
  });

  // Calculate geographical hotspots
  const regionCounts: Record<string, { count: number; totalTruthScore: number }> = {};
  nodes.forEach(node => {
    if (!regionCounts[node.location.region]) {
      regionCounts[node.location.region] = { count: 0, totalTruthScore: 0 };
    }
    regionCounts[node.location.region].count++;
    regionCounts[node.location.region].totalTruthScore += node.truthScore;
  });

  const geographicalHotspots = Object.entries(regionCounts).map(([region, data]) => ({
    region,
    nodeCount: data.count,
    avgTruthScore: Math.round(data.totalTruthScore / data.count)
  }));

  // Find strongest connections
  const strongestConnections: Array<{ from: string; to: string; strength: number }> = [];
  nodes.forEach(node => {
    node.connections.forEach(connectionId => {
      const connectedNode = nodes.find(n => n.id === connectionId);
      if (connectedNode) {
        const strength = (node.truthScore + connectedNode.truthScore) / 200;
        strongestConnections.push({
          from: node.id,
          to: connectionId,
          strength
        });
      }
    });
  });

  strongestConnections.sort((a, b) => b.strength - a.strength);

  return {
    totalNodes: nodes.length,
    verifiedNodes: verifiedNodes.length,
    avgTruthScore: Math.round(avgTruthScore),
    strongestConnections: strongestConnections.slice(0, 10),
    emotionalDistribution,
    geographicalHotspots: geographicalHotspots.slice(0, 8)
  };
}

export async function getTruthNetwork(req: Request, res: Response) {
  try {
    const { region, category, verified, minTruthScore } = req.query;
    
    console.log("🌐 Generating Truth Network visualization...");
    
    // Generate or fetch truth network data
    let nodes = generateTruthNetwork();
    
    // Apply filters
    if (region && region !== "all") {
      nodes = nodes.filter(node => 
        node.location.region.toLowerCase() === (region as string).toLowerCase()
      );
    }
    
    if (category && category !== "all") {
      nodes = nodes.filter(node => 
        node.category.toLowerCase() === (category as string).toLowerCase()
      );
    }
    
    if (verified === "true") {
      nodes = nodes.filter(node => node.verified);
    }
    
    if (minTruthScore) {
      const minScore = parseInt(minTruthScore as string);
      nodes = nodes.filter(node => node.truthScore >= minScore);
    }

    const stats = calculateNetworkStats(nodes);
    
    console.log(`✅ Truth Network generated: ${nodes.length} nodes, ${stats.verifiedNodes} verified`);
    
    res.json({
      nodes,
      stats,
      meta: {
        timestamp: new Date().toISOString(),
        filters: { region, category, verified, minTruthScore },
        totalConnections: nodes.reduce((sum, node) => sum + node.connections.length, 0)
      }
    });

  } catch (error) {
    console.error("❌ Truth Network generation failed:", error);
    res.status(500).json({ error: "Failed to generate truth network" });
  }
}

export async function getNetworkAnalytics(req: Request, res: Response) {
  try {
    const { timeRange = "30d", metric = "all" } = req.query;
    
    console.log(`📊 Generating network analytics for ${timeRange}...`);
    
    const analytics = {
      growth: {
        newNodes: Math.floor(Math.random() * 100) + 50,
        newConnections: Math.floor(Math.random() * 200) + 100,
        verificationRate: 0.75 + Math.random() * 0.24,
        avgTruthScore: 87 + Math.random() * 12
      },
      influence: {
        topInfluencers: [
          { nodeId: "node_001", influence: 0.95, connections: 45 },
          { nodeId: "node_015", influence: 0.89, connections: 38 },
          { nodeId: "node_032", influence: 0.84, connections: 32 }
        ],
        cascadeEvents: Math.floor(Math.random() * 20) + 5,
        viralThreshold: 0.75
      },
      consensus: {
        agreementRate: 0.82 + Math.random() * 0.17,
        disputedCapsules: Math.floor(Math.random() * 10) + 2,
        verificationBacklog: Math.floor(Math.random() * 25) + 5
      }
    };
    
    res.json(analytics);

  } catch (error) {
    console.error("❌ Network analytics generation failed:", error);
    res.status(500).json({ error: "Failed to generate analytics" });
  }
}

export async function exportTruthNetwork(req: Request, res: Response) {
  try {
    const { format = "json", includePrivate = "false" } = req.query;
    
    const nodes = generateTruthNetwork();
    const filteredNodes = includePrivate === "true" ? nodes : nodes.filter(n => n.verified);
    
    if (format === "csv") {
      // Generate CSV export
      const csvHeader = "ID,Title,Category,TruthScore,Country,Verified,Timestamp\n";
      const csvRows = filteredNodes.map(node => 
        `${node.id},${node.title},${node.category},${node.truthScore},${node.location.country},${node.verified},${node.timestamp}`
      ).join("\n");
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="truth-network.csv"');
      res.send(csvHeader + csvRows);
      
    } else if (format === "graphml") {
      // Generate GraphML for network analysis tools
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', 'attachment; filename="truth-network.graphml"');
      res.status(501).json({ error: "GraphML export not implemented yet" });
      
    } else {
      // Default JSON export
      res.json({
        format: "truth-network-export",
        version: "1.0",
        timestamp: new Date().toISOString(),
        nodes: filteredNodes,
        stats: calculateNetworkStats(filteredNodes)
      });
    }

  } catch (error) {
    console.error("❌ Truth Network export failed:", error);
    res.status(500).json({ error: "Export failed" });
  }
}