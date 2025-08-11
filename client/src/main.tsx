// Disable Lit development mode warnings
(globalThis as any).litIssuedWarnings = new Set();



import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./ErrorBoundary";
import "./index.css";
import registerServiceWorker from "./lib/registerServiceWorker";
import { PostHogProvider } from "posthog-js/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Debug overlay for runtime errors
function DebugOverlay() {
	const [error, setError] = React.useState<string | null>(null);
	const [isVisible, setIsVisible] = React.useState(true);
	
	React.useEffect(() => {
		const handleError = (e: ErrorEvent) => {
			console.error('Runtime Error:', e.error);
			setError(e.error ? e.error.stack : e.message);
		};
		
		const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
			console.error('Unhandled Promise Rejection:', e.reason);
			setError(e.reason ? e.reason.stack || String(e.reason) : 'Unhandled promise rejection');
		};
		
		window.addEventListener('error', handleError);
		window.addEventListener('unhandledrejection', handleUnhandledRejection);
		
		return () => {
			window.removeEventListener('error', handleError);
			window.removeEventListener('unhandledrejection', handleUnhandledRejection);
		};
	}, []);
	
	if (!error || !isVisible) return null;
	
	return (
		<div style={{
			position:'fixed',
			top:0,
			left:0,
			right:0,
			zIndex:9999,
			background:'#b91c1c',
			color:'#fff',
			padding:'16px',
			fontFamily:'monospace',
			boxShadow:'0 4px 8px rgba(0,0,0,0.3)'
		}}>
			<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
				<b>⚠️ Runtime Error Detected:</b>
				<button 
					onClick={() => setIsVisible(false)}
					style={{
						background:'transparent',
						border:'1px solid #fff',
						color:'#fff',
						padding:'4px 8px',
						cursor:'pointer',
						borderRadius:'3px'
					}}
				>
					✕ Close
				</button>
			</div>
			<pre style={{whiteSpace:'pre-wrap',margin:0,fontSize:'12px',maxHeight:'200px',overflow:'auto'}}>
				{error}
			</pre>
		</div>
	);
}

// Register Service Worker for PWA functionality
registerServiceWorker();

// Check for required environment variables
const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (!posthogKey) {
	console.warn('⚠️ PostHog API key not found. Analytics will be disabled.');
}

createRoot(document.getElementById("root")!).render(
	<>
		<DebugOverlay />
		<ErrorBoundary>
			{posthogKey ? (
				<PostHogProvider
					apiKey={posthogKey}
					options={{
						api_host: posthogHost || "https://us.i.posthog.com",
						persistence: "localStorage",
						capture_pageview: true,
						capture_pageleave: true,
						defaults: "2025-05-24",
						capture_exceptions: true,
						debug: import.meta.env.MODE === "development",
					}}
				>
					<>
						<SpeedInsights />
						<App />
					</>
				</PostHogProvider>
			) : (
				<>
					<SpeedInsights />
					<App />
				</>
			)}
		</ErrorBoundary>
	</>
);