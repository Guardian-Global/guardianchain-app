"use client";
import { DownloadCloud } from "lucide-react";

export default function CapsuleLauncherButton() {
  const handleDownload = () => {
    window.open("/downloads/capsule-launcher-v1.zip", "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-6 py-3 text-lg font-bold rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-700 text-white dark:text-white shadow-md hover:shadow-xl hover:from-indigo-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
      data-testid="button-capsule-launcher-download"
    >
      <DownloadCloud className="mr-2" size={20} /> 
      Capsule Launcher v1.0
    </button>
  );
}