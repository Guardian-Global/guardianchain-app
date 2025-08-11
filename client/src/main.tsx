// Disable Lit development mode warnings
(globalThis as any).litIssuedWarnings = new Set();

import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./ErrorBoundary";
import "./index.css";
import registerServiceWorker from "./lib/registerServiceWorker";
import { PostHogProvider } from "posthog-js/react";

// Register Service Worker for PWA functionality
registerServiceWorker();

createRoot(document.getElementById("root")!).render(
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
			<App />
		</PostHogProvider>
	</ErrorBoundary>
);