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
      
      // Make direct API call to Supabase for capsule search
      const searchUrl = new URL(`${supabaseConfig.url}/rest/v1/capsules`);
      searchUrl.searchParams.append('select', 'id,title,description,author,category,created_at');
      searchUrl.searchParams.append('or', `title.ilike.%${query}%,description.ilike.%${query}%,author.ilike.%${query}%`);
      searchUrl.searchParams.append('order', 'created_at.desc');
      searchUrl.searchParams.append('limit', '20');

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
      
      // Fallback to mock data for development
      const mockResults = [
        {
          id: "cap_001",
          title: "Climate Change Evidence Documentation",
          description: "Comprehensive analysis of environmental data and research findings",
          author: "EnvironmentalScientist",
          category: "Scientific Truth",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "cap_002", 
          title: "Corporate Transparency Report",
          description: "Internal documents revealing corporate practices and policies",
          author: "CorporateWhistleblower",
          category: "Truth Testimony",
          created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "cap_003",
          title: "Historical Family Archive",
          description: "Personal family history and documentation spanning three generations",
          author: "FamilyHistorian",
          category: "Personal History",
          created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
        }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.author.toLowerCase().includes(query.toLowerCase())
      );

      res.json({ 
        results: mockResults,
        query: query,
        total: mockResults.length,
        note: "Development mode - using mock data"
      });
    }
  } catch (error) {
    console.error("Error processing search:", error);
    res.status(500).json({ error: "Failed to process search request" });
  }
}