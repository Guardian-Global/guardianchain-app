#!/usr/bin/env python3
"""
GuardianChain Fallback Clustering Pipeline
Demonstrates clustering functionality using TF-IDF vectors when OpenAI API is unavailable
"""

import os
import json
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import silhouette_score
import sys
from datetime import datetime

class FallbackClusteringPipeline:
    """Fallback clustering pipeline using TF-IDF when OpenAI API is unavailable"""
    
    def __init__(self):
        self.cluster_model = None
        self.pca_model = None
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.scaler = StandardScaler()
        
    def fetch_capsules_from_api(self) -> pd.DataFrame:
        """Fetch capsules from GuardianChain API or create demo data"""
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
            },
            {
                "id": "cap_1754140006_pqr678",
                "title": "Childhood Trauma Recovery",
                "description": "Finally confronting the abuse I suffered as a child and finding healing",
                "content": "It took decades to find the courage to speak about what happened. Therapy has been life-changing.",
                "emotional_score": 4.7,
                "grief_score": 8.5,
                "timestamp": "2022-09-12T16:45:00Z",
                "category": "healing",
                "creator_id": "user_987",
                "tags": ["trauma", "healing", "therapy", "courage", "recovery"]
            },
            {
                "id": "cap_1754140007_stu901",
                "title": "Wedding Day Bliss",
                "description": "The most perfect day of my life, surrounded by family and friends",
                "content": "When I saw her walking down the aisle, time stopped. Everything was exactly as we dreamed.",
                "emotional_score": 9.8,
                "grief_score": 0.5,
                "timestamp": "2019-06-21T15:00:00Z",
                "category": "celebration",
                "creator_id": "user_456",
                "tags": ["wedding", "love", "celebration", "family", "joy"]
            },
            {
                "id": "cap_1754140008_vwx234",
                "title": "Father's Final Words",
                "description": "The last conversation I had with my dad before he passed from cancer",
                "content": "He told me he was proud of who I'd become and that he'd always watch over me.",
                "emotional_score": 6.2,
                "grief_score": 9.5,
                "timestamp": "2021-03-08T22:30:00Z",
                "category": "loss",
                "creator_id": "user_654",
                "tags": ["death", "father", "cancer", "final", "love"]
            }
        ]
        
        return pd.DataFrame(sample_capsules)
    
    def generate_tfidf_features(self, texts: List[str]) -> np.ndarray:
        """Generate TF-IDF feature vectors for text clustering"""
        try:
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(texts)
            return tfidf_matrix.toarray()
        except Exception as e:
            print(f"Error generating TF-IDF features: {str(e)}")
            # Return zero vectors as fallback
            return np.zeros((len(texts), 100))
    
    def determine_optimal_clusters(self, features: np.ndarray, max_clusters: int = 6) -> int:
        """Use silhouette analysis to determine optimal number of clusters"""
        if len(features) < 2:
            return 1
            
        best_score = -1
        best_k = 2
        
        max_k = min(max_clusters, len(features) - 1)
        
        for k in range(2, max_k + 1):
            try:
                kmeans = KMeans(n_clusters=k, random_state=42, n_init='auto')
                cluster_labels = kmeans.fit_predict(features)
                
                # Check if we have enough unique clusters
                unique_labels = np.unique(cluster_labels)
                if len(unique_labels) < 2:
                    continue
                    
                score = silhouette_score(features, cluster_labels)
                
                if score > best_score:
                    best_score = score
                    best_k = k
            except Exception as e:
                print(f"Error testing {k} clusters: {str(e)}")
                continue
                
        print(f"Optimal clusters: {best_k} (silhouette score: {best_score:.3f})")
        return best_k
    
    def generate_cluster_themes(self, df: pd.DataFrame) -> Dict[int, Dict[str, Any]]:
        """Generate cluster themes based on content analysis"""
        cluster_analysis = {}
        
        for cluster_id in df['cluster'].unique():
            cluster_data = df[df['cluster'] == cluster_id]
            
            # Aggregate cluster characteristics
            avg_emotional_score = cluster_data['emotional_score'].mean()
            avg_grief_score = cluster_data['grief_score'].mean()
            
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
            
            # Generate theme based on patterns
            sample_titles = cluster_data['title'].iloc[:3].tolist()
            
            # Simple rule-based theme generation
            if avg_grief_score > 7:
                theme_name = "Grief & Loss"
            elif avg_emotional_score > 8:
                theme_name = "Joy & Celebration"
            elif "family" in common_tags:
                theme_name = "Family Memories"
            elif "professional" in cluster_data['category'].values:
                theme_name = "Professional Life"
            elif "love" in common_tags or "romance" in common_tags:
                theme_name = "Love & Romance"
            else:
                theme_name = f"Life Cluster {cluster_id}"
            
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
        """Execute complete clustering pipeline with TF-IDF fallback"""
        print("🔬 Starting GuardianChain Fallback Clustering Pipeline...")
        
        # Fetch capsule data
        print("📥 Fetching capsules...")
        df = self.fetch_capsules_from_api()
        
        if len(df) < 2:
            return {"error": "Insufficient data for clustering (minimum 2 capsules required)"}
        
        # Prepare text for feature extraction
        df["combined_text"] = df["title"] + ": " + df["description"] + " " + df["content"]
        df["year"] = pd.to_datetime(df["timestamp"]).dt.year
        
        # Generate TF-IDF features
        print("🧠 Generating TF-IDF features...")
        features = self.generate_tfidf_features(df["combined_text"].tolist())
        
        # Determine optimal number of clusters
        print("🎯 Determining optimal cluster count...")
        n_clusters = self.determine_optimal_clusters(features)
        
        # Perform clustering
        print(f"🔄 Clustering into {n_clusters} groups...")
        self.cluster_model = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
        df["cluster"] = self.cluster_model.fit_predict(features)
        
        # Reduce dimensions for visualization
        print("📊 Preparing visualization data...")
        self.pca_model = PCA(n_components=2, random_state=42)
        reduced_features = self.pca_model.fit_transform(features)
        df["x"] = reduced_features[:, 0]
        df["y"] = reduced_features[:, 1]
        
        # Analyze cluster themes
        print("🎨 Analyzing cluster themes...")
        cluster_analysis = self.generate_cluster_themes(df)
        
        # Prepare results
        results = {
            "clustering_summary": {
                "total_capsules": len(df),
                "n_clusters": n_clusters,
                "clustering_algorithm": "KMeans with TF-IDF",
                "embedding_model": "TF-IDF Vectorizer (Fallback)",
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
        
        # Convert numpy types to native Python types for JSON serialization
        for key, value in results["visualization_data"].items():
            if isinstance(value, list):
                results["visualization_data"][key] = [float(x) if isinstance(x, (np.int32, np.int64, np.float32, np.float64)) else x for x in value]
        
        # Convert cluster keys to strings
        cluster_themes_str_keys = {}
        for k, v in results["cluster_themes"].items():
            cluster_themes_str_keys[str(k)] = v
        results["cluster_themes"] = cluster_themes_str_keys
        
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
    """Main execution function for fallback clustering"""
    pipeline = FallbackClusteringPipeline()
    
    try:
        results = pipeline.run_clustering_pipeline()
        
        if "error" not in results:
            print("\n🎉 Fallback clustering pipeline completed successfully!")
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
        print(f"💥 Fallback pipeline failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()