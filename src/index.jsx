import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PlanProvider } from './context/PlanContext';
import { AuthProvider } from './context/AuthContext';
import "./styles/tailwind.css";
import "./styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container);

// Dev helper: log component errors captured by ErrorBoundary
window.__COMPONENT_ERROR__ = (error, info) => {
  console.error('[ErrorBoundary]', error, info);
};

root.render(
	<AuthProvider>
		<PlanProvider>
			<App />
		</PlanProvider>
	</AuthProvider>
);
