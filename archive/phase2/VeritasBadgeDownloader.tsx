"use client";
import { Download } from "lucide-react";
import { useState } from "react";

export default function VeritasBadgeDownloader({ badgeUrl }: { badgeUrl: string }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!badgeUrl) return;
    
    setDownloading(true);
    try {
      // Fetch the image to ensure it exists and get proper blob
      const response = await fetch(badgeUrl);
      if (!response.ok) throw new Error('Failed to fetch badge');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = "veritas-badge.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download badge:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="text-center py-4">
      <img 
        src={badgeUrl} 
        alt="Veritas Badge" 
        className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 rounded-xl border-2 border-indigo-500 dark:border-cyan-400 object-cover shadow-lg hover:scale-105 transition-transform duration-300" 
        onError={(e) => {
          const target = e.currentTarget;
          target.src = "/assets/placeholder-badge.png";
        }}
      />
      <button
        onClick={handleDownload}
        className="inline-flex items-center bg-gradient-to-br from-violet-600 to-indigo-900 dark:from-cyan-600 dark:to-purple-900 text-white dark:text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:from-indigo-500 hover:to-purple-800 dark:hover:from-cyan-500 dark:hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        disabled={downloading || !badgeUrl}
        data-testid="button-download-veritas-badge"
      >
        <Download className="mr-2" size={18} />
        {downloading ? "Downloading..." : "Download Veritas Badge"}
      </button>
    </div>
  );
}