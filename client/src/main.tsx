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
	React.useEffect(() => {
		const handleError = (e: ErrorEvent) => {
			setError(e.error ? e.error.stack : e.message);
		};
		const handleRejection = (e: PromiseRejectionEvent) => {
			setError(e.reason ? e.reason.stack : String(e.reason));
		};
		
		window.addEventListener('error', handleError);
		window.addEventListener('unhandledrejection', handleRejection);
		
		return () => {
			window.removeEventListener('error', handleError);
			window.removeEventListener('unhandledrejection', handleRejection);
		};
	}, []);
	
	if (!error) return null;
	
	return (
		<div style={{position:'fixed',top:0,left:0,right:0,zIndex:9999,background:'#b91c1c',color:'#fff',padding:'16px',fontFamily:'monospace'}}>
			<b>Runtime Error:</b>
			<pre style={{whiteSpace:'pre-wrap'}}>{error}</pre>
		</div>
	);
}

// Register Service Worker for PWA functionality
registerServiceWorker();

// Ensure root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found. Please check your HTML file contains a div with id='root'");
}

// Safe PostHog initialization
const posthogConfig = {
	apiKey: import.meta.env.VITE_PUBLIC_POSTHOG_KEY || "",
	options: {
		api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
		person_profiles: "identified_only" as const,
		capture_pageview: true,
		capture_pageleave: true,
		capture_exceptions: true,
		debug: import.meta.env.MODE === "development",
		// Disable in production if no API key
		loaded: (posthog: any) => {
			if (import.meta.env.MODE === "development") {
				console.log("PostHog loaded successfully");
			}
		},
		// Handle loading errors gracefully
		on_request_error: (err: any) => {
			if (import.meta.env.MODE === "development") {
				console.warn("PostHog request error:", err);
			}
		}
	}
};

createRoot(rootElement).render(
	<React.StrictMode>
		<DebugOverlay />
		<ErrorBoundary>
			{posthogConfig.apiKey ? (
				<PostHogProvider
					apiKey={posthogConfig.apiKey}
					options={posthogConfig.options}
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
	</React.StrictMode>
);