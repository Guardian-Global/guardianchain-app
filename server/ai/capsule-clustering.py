#!/usr/bin/env python3
"""
GuardianChain Capsule Clustering Pipeline
Advanced AI-powered clustering of truth capsules by sentiment, era, and emotional patterns
"""

import os
import json
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import sys
from datetime import datetime
try:
    from openai import OpenAI
    # Initialize OpenAI client
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except ImportError:
    print("OpenAI package not found. Please install with: pip install openai")
    sys.exit(1)

class CapsuleClusteringPipeline:
    """Advanced clustering pipeline for GuardianChain truth capsules"""
    
    def __init__(self):
        self.embeddings_cache = {}
        self.cluster_model = None
        self.pca_model = None
        self.scaler = StandardScaler()
        
    def fetch_capsules_from_api(self) -> pd.DataFrame:
        """Fetch capsules from GuardianChain API or database"""
        # In production, this would connect to the actual database
        # For now, we'll create representative sample data based on GuardianChain's schema
        sample_capsules = [
            {
                "id": "cap_1754140001_abc123",
                "title": "Family Memory from 1995",
                "description": "A cherished moment when my grandmother taught me to bake her famous apple pie recipe during Christmas",
                "content": "The kitchen smelled of cinnamon and love. She guided my small hands, showing me how to roll the dough just right.",
                "emotional_score": 8.5,
                "grief_score": 2.0,
                "timestamp": "1995-12-24T15:30:00Z",
                "category": "family",
                "creator_id": "user_456",
                "tags": ["family", "tradition", "cooking", "grandmother", "christmas"]
            },
            {
                "id": "cap_1754140002_def456", 
                "title": "Corporate Whistleblowing 2020",
                "description": "Evidence of financial misconduct at TechCorp involving $2.3M in fraudulent transactions",
                "content": "Internal emails reveal systematic manipulation of quarterly reports to inflate revenue figures.",
                "emotional_score": 3.2,
                "grief_score": 7.8,
                "timestamp": "2020-06-15T09:45:00Z",
                "category": "professional",
                "creator_id": "user_789",
                "tags": ["whistleblowing", "fraud", "corporate", "evidence", "legal"]
            },
            {
                "id": "cap_1754140003_ghi789",
                "title": "Loss of a Best Friend",
                "description": "Tribute to Sarah, who passed away in a car accident last month",
                "content": "Sarah had this infectious laugh that could light up any room. I miss our daily coffee conversations.",
                "emotional_score": 2.1,
                "grief_score": 9.2,
                "timestamp": "2024-07-10T18:20:00Z",
                "category": "grief",
                "creator_id": "user_123",
                "tags": ["loss", "friendship", "grief", "tribute", "memory"]
            },
            {
                "id": "cap_1754140004_jkl012",
                "title": "Graduation Day Achievement",
                "description": "Finally earned my PhD in Computer Science after 6 years of hard work",
                "content": "Walking across that stage, I thought of all the late nights and challenges that led to this moment.",
                "emotional_score": 9.1,
                "grief_score": 1.5,
                "timestamp": "2023-05-18T14:00:00Z",
                "category": "milestone",
                "creator_id": "user_321",
                "tags": ["education", "achievement", "graduation", "phd", "success"]
            },
            {
                "id": "cap_1754140005_mno345",
                "title": "First Love Letter",
                "description": "The handwritten letter that started our 25-year marriage",
                "content": "Your eyes hold the universe, and in them I've found my home. Will you walk this journey with me?",
                "emotional_score": 9.5,
                "grief_score": 0.8,
                "timestamp": "1998-02-14T20:30:00Z",
                "category": "love",
                "creator_id": "user_654",
                "tags": ["love", "romance", "marriage", "letter", "relationship"]
            }
        ]
        
        return pd.DataFrame(sample_capsules)
    
    def generate_enhanced_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings using OpenAI's latest embedding model"""
        embeddings = []
        
        for text in texts:
            if text in self.embeddings_cache:
                embeddings.append(self.embeddings_cache[text])
                continue
                
            try:
                response = client.embeddings.create(
                    input=text,
                    model="text-embedding-3-small"  # Latest OpenAI embedding model
                )
                embedding = response.data[0].embedding
                self.embeddings_cache[text] = embedding
                embeddings.append(embedding)
                
            except Exception as e:
                print(f"Error generating embedding for text: {str(e)}")
                # Fallback to zero vector if API fails
                embeddings.append([0.0] * 1536)  # text-embedding-3-small dimension
                
        return embeddings
    
    def determine_optimal_clusters(self, embeddings: np.ndarray, max_clusters: int = 10) -> int:
        """Use silhouette analysis to determine optimal number of clusters"""
        best_score = -1
        best_k = 2
        
        for k in range(2, min(max_clusters + 1, len(embeddings))):
            kmeans = KMeans(n_clusters=k, random_state=42, n_init='auto')
            cluster_labels = kmeans.fit_predict(embeddings)
            score = silhouette_score(embeddings, cluster_labels)
            
            if score > best_score:
                best_score = score
                best_k = k
                
        print(f"Optimal clusters: {best_k} (silhouette score: {best_score:.3f})")
        return best_k
    
    def analyze_cluster_themes(self, df: pd.DataFrame) -> Dict[int, Dict[str, Any]]:
        """Analyze themes and characteristics of each cluster using AI"""
        cluster_analysis = {}
        
        for cluster_id in df['cluster'].unique():
            cluster_data = df[df['cluster'] == cluster_id]
            
            # Aggregate cluster characteristics
            avg_emotional_score = cluster_data['emotional_score'].mean()
            avg_grief_score = cluster_data['grief_score'].mean()
            common_tags = []
            
            # Extract common tags
            all_tags = []
            for tags in cluster_data['tags']:
                all_tags.extend(tags)
            tag_counts = pd.Series(all_tags).value_counts()
            common_tags = tag_counts.head(5).index.tolist()
            
            # Time period analysis
            timestamps = pd.to_datetime(cluster_data['timestamp'])
            era_start = timestamps.dt.year.min()
            era_end = timestamps.dt.year.max()
            
            # Generate cluster theme using AI
            sample_titles = cluster_data['title'].iloc[:3].tolist()
            sample_descriptions = cluster_data['description'].iloc[:3].tolist()
            
            theme_prompt = f"""
            Analyze this cluster of truth capsules and provide a descriptive theme name:
            
            Titles: {sample_titles}
            Descriptions: {sample_descriptions}
            Common tags: {common_tags}
            Average emotional score: {avg_emotional_score:.1f}/10
            Average grief score: {avg_grief_score:.1f}/10
            Time period: {era_start}-{era_end}
            
            Provide a 2-4 word theme name that captures the essence of this cluster.
            """
            
            try:
                response = client.chat.completions.create(
                    model="gpt-4o",  # Latest OpenAI model
                    messages=[
                        {"role": "system", "content": "You are an expert at analyzing emotional patterns in personal narratives and memories."},
                        {"role": "user", "content": theme_prompt}
                    ],
                    max_tokens=50,
                    temperature=0.3
                )
                content = response.choices[0].message.content
                theme_name = content.strip().strip('"') if content else f"Cluster {cluster_id}"
            except Exception as e:
                print(f"Error generating theme for cluster {cluster_id}: {str(e)}")
                theme_name = f"Cluster {cluster_id}"
            
            cluster_analysis[cluster_id] = {
                "theme_name": theme_name,
                "size": len(cluster_data),
                "avg_emotional_score": round(avg_emotional_score, 2),
                "avg_grief_score": round(avg_grief_score, 2),
                "common_tags": common_tags,
                "era_range": f"{era_start}-{era_end}",
                "sample_titles": sample_titles
            }
            
        return cluster_analysis
    
    def run_clustering_pipeline(self) -> Dict[str, Any]:
        """Execute complete clustering pipeline"""
        print("🔬 Starting GuardianChain Capsule Clustering Pipeline...")
        
        # Fetch capsule data
        print("📥 Fetching capsules...")
        df = self.fetch_capsules_from_api()
        
        if len(df) < 2:
            return {"error": "Insufficient data for clustering (minimum 2 capsules required)"}
        
        # Prepare text for embedding
        df["combined_text"] = df["title"] + ": " + df["description"] + " " + df["content"]
        df["year"] = pd.to_datetime(df["timestamp"]).dt.year
        
        # Generate embeddings
        print("🧠 Generating AI embeddings...")
        embeddings = self.generate_enhanced_embeddings(df["combined_text"].tolist())
        embeddings_array = np.array(embeddings)
        
        # Determine optimal number of clusters
        print("🎯 Determining optimal cluster count...")
        n_clusters = self.determine_optimal_clusters(embeddings_array)
        
        # Perform clustering
        print(f"🔄 Clustering into {n_clusters} groups...")
        self.cluster_model = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
        df["cluster"] = self.cluster_model.fit_predict(embeddings_array)
        
        # Reduce dimensions for visualization
        print("📊 Preparing visualization data...")
        self.pca_model = PCA(n_components=2, random_state=42)
        reduced_embeddings = self.pca_model.fit_transform(embeddings_array)
        df["x"] = reduced_embeddings[:, 0]
        df["y"] = reduced_embeddings[:, 1]
        
        # Analyze cluster themes
        print("🎨 Analyzing cluster themes...")
        cluster_analysis = self.analyze_cluster_themes(df)
        
        # Prepare results
        results = {
            "clustering_summary": {
                "total_capsules": len(df),
                "n_clusters": n_clusters,
                "clustering_algorithm": "KMeans",
                "embedding_model": "text-embedding-3-small",
                "analysis_timestamp": datetime.now().isoformat()
            },
            "cluster_themes": cluster_analysis,
            "capsule_data": df.to_dict('records'),
            "visualization_data": {
                "x_coordinates": df["x"].tolist(),
                "y_coordinates": df["y"].tolist(),
                "cluster_labels": df["cluster"].tolist(),
                "capsule_ids": df["id"].tolist(),
                "titles": df["title"].tolist()
            }
        }
        
        # Save results
        output_file = "clustered_capsules_analysis.json"
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)
            
        print(f"✅ Clustering analysis complete! Results saved to {output_file}")
        print(f"📈 Discovered {n_clusters} distinct thematic clusters")
        
        for cluster_id, analysis in cluster_analysis.items():
            print(f"   • Cluster {cluster_id}: {analysis['theme_name']} ({analysis['size']} capsules)")
        
        return results

def main():
    """Main execution function"""
    pipeline = CapsuleClusteringPipeline()
    
    try:
        results = pipeline.run_clustering_pipeline()
        
        if "error" not in results:
            print("\n🎉 Capsule clustering pipeline completed successfully!")
            print(f"   Total capsules analyzed: {results['clustering_summary']['total_capsules']}")
            print(f"   Clusters discovered: {results['clustering_summary']['n_clusters']}")
            
            # Print cluster summary
            print("\n📊 Cluster Summary:")
            for cluster_id, analysis in results['cluster_themes'].items():
                print(f"   {analysis['theme_name']}: {analysis['size']} capsules")
                print(f"      • Emotional range: {analysis['avg_emotional_score']}/10")
                print(f"      • Grief intensity: {analysis['avg_grief_score']}/10") 
                print(f"      • Era: {analysis['era_range']}")
                print(f"      • Tags: {', '.join(analysis['common_tags'][:3])}")
                print()
        else:
            print(f"❌ Error: {results['error']}")
            
    except Exception as e:
        print(f"💥 Pipeline failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()