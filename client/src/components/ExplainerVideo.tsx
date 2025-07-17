import React from "react";

export default function ExplainerVideo() {
  return (
    <div className="w-full max-w-5xl mx-auto mt-8 rounded-lg overflow-hidden shadow-2xl bg-slate-900 border border-slate-700">
      <video
        controls
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-auto object-cover rounded-t-lg"
        poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2NzUiIHZpZXdCb3g9IjAgMCAxMjAwIDY3NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjc1IiBmaWxsPSIjMUUyOTMzIi8+CjxjaXJjbGUgY3g9IjYwMCIgY3k9IjMzNy41IiByPSI1MCIgZmlsbD0iI0Y1OUUwQiIvPgo8cGF0aCBkPSJNNTg1IDMxNS41TDYyNSAzMzcuNUw1ODUgMzU5LjVWMzE1LjVaIiBmaWxsPSIjMUUyOTMzIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iNDIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRjU5RTBCIiBmb250LWZhbWlseT0ic2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIj5HVUFSREFOQ0hBSU48L3RleHQ+Cjx0ZXh0IHg9IjYwMCIgeT0iNDUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTRBM0I4IiBmb250LWZhbWlseT0ic2VyaWYiIGZvbnQtc2l6ZT0iMTYiPkltbXV0YWJsZSBUcnV0aCBpbiBNb3Rpb248L3RleHQ+Cjwvc3ZnPgo="
      >
        <source
          src="https://mpjgcleldijxkvbuxiqg.supabase.co/storage/v1/object/public/media-assets//GUADIANCHAIN%20NFT%20VIDEO.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              GUARDIAN<span className="text-yellow-400">CHAIN</span> Explainer
            </h3>
            <p className="text-sm text-slate-300">
              Immutable Truth in Motion — See how capsules become verifiable digital proof
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}