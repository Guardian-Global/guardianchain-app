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
	const [error, setError] = React.useState(null);
	React.useEffect(() => {
		window.addEventListener('error', e => {
			setError(e.error ? e.error.stack : e.message);
		});
		window.addEventListener('unhandledrejection', e => {
			setError(e.reason ? e.reason.stack : e.reason);
		});
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

createRoot(document.getElementById("root")!).render(
	<>
		<DebugOverlay />
		<ErrorBoundary>
			<PostHogProvider
				apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
				options={{
					api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
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
		</ErrorBoundary>
	</>
);