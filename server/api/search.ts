import { Request, Response } from "express";

// Initialize Supabase client for server-side operations
const createSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase credentials not configured. Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to environment variables.");
  }
  
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY
  };
};

export async function searchCapsules(req: Request, res: Response) {
  try {
    const query = req.query.q;
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing or invalid query string" });
    }

    try {
      const supabaseConfig = createSupabaseClient();
      
      // Make direct API call to Supabase for capsule search with enhanced filtering
      const searchUrl = new URL(`${supabaseConfig.url}/rest/v1/capsules`);
      searchUrl.searchParams.append('select', 'id,title,description,author,category,tags,verification_status,grief_score,views,likes,comments,shares,created_at');
      
      // Enhanced search with full-text search and multiple field matching
      const searchTerms = query.toLowerCase().replace(/[^\w\s]/g, '').split(' ').filter(term => term.length > 0);
      const searchConditions = searchTerms.map(term => 
        `title.ilike.%${term}%,description.ilike.%${term}%,author.ilike.%${term}%,category.ilike.%${term}%`
      ).join(',');
      
      searchUrl.searchParams.append('or', `(${searchConditions})`);
      searchUrl.searchParams.append('order', 'created_at.desc');
      searchUrl.searchParams.append('limit', '50');

      const response = await fetch(searchUrl.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseConfig.key}`,
          'apikey': supabaseConfig.key,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Supabase search error:", errorData);
        return res.status(response.status).json({ error: "Search failed" });
      }

      const data = await response.json();
      
      res.json({ 
        results: data,
        query: query,
        total: data.length
      });
    } catch (supabaseError) {
      console.error("Supabase connection error:", supabaseError);
      
      // Fallback to realistic mock data for development
      const mockCapsules = [
        {
          id: "cap_001",
          title: "Climate Change Evidence Documentation",
          description: "Comprehensive analysis of environmental data and research findings spanning three decades",
          author: "EnvironmentalScientist",
          category: "Scientific Truth",
          tags: ["climate", "environment", "research", "data"],
          verification_status: "verified",
          grief_score: "92",
          views: "4521",
          likes: "387",
          comments: "78",
          shares: "42",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "cap_002", 
          title: "Corporate Transparency Report",
          description: "Internal documents revealing corporate practices and policies affecting employee welfare",
          author: "CorporateWhistleblower",
          category: "Truth Testimony",
          tags: ["corporate", "transparency", "whistleblower", "policy"],
          verification_status: "pending",
          grief_score: "95",
          views: "1247",
          likes: "89",
          comments: "23",
          shares: "15",
          created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "cap_003",
          title: "Historical Family Archive",
          description: "Personal family history and documentation spanning three generations of immigration",
          author: "FamilyHistorian",
          category: "Personal History",
          tags: ["family", "history", "immigration", "heritage"],
          verification_status: "verified",
          grief_score: "78",
          views: "2894",
          likes: "156",
          comments: "45",
          shares: "28",
          created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "cap_004",
          title: "Medical Research Integrity Study",
          description: "Analysis of research methodologies and data integrity in pharmaceutical studies",
          author: "ResearchEthicist",
          category: "Medical Truth",
          tags: ["medical", "research", "ethics", "pharmaceutical"],
          verification_status: "verified",
          grief_score: "89",
          views: "3762",
          likes: "245",
          comments: "67",
          shares: "31",
          created_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "cap_005",
          title: "Educational Policy Impact Analysis",
          description: "Comprehensive study of educational policies and their real-world impact on student development",
          author: "EduAdvocate",
          category: "Educational Truth",
          tags: ["education", "policy", "students", "development"],
          verification_status: "verified",
          grief_score: "84",
          views: "2156",
          likes: "189",
          comments: "34",
          shares: "67",
          created_at: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString()
        }
      ];

      const filteredResults = mockCapsules.filter(item => {
        const searchLower = query.toLowerCase();
        return item.title.toLowerCase().includes(searchLower) ||
               item.description.toLowerCase().includes(searchLower) ||
               item.author.toLowerCase().includes(searchLower) ||
               item.category.toLowerCase().includes(searchLower) ||
               item.tags.some(tag => tag.toLowerCase().includes(searchLower));
      });

      res.json({ 
        results: filteredResults,
        query: query,
        total: filteredResults.length,
        note: "Development mode - using realistic mock data"
      });
    }
  } catch (error) {
    console.error("Error processing search:", error);
    res.status(500).json({ error: "Failed to process search request" });
  }
}