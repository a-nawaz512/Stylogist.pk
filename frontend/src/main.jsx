import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"

// Reasonable defaults for a storefront: cache product/category responses for
// a minute so back/forward is instant, and avoid refetching on window focus
// which burns bandwidth during casual browsing.
//
// Exported so React Router route-loaders (e.g. the /product/:slug PDP) can
// prefetch into the same cache before the component mounts. That eliminates
// the "loading skeleton -> data" flash and ensures structured data (JSON-LD)
// is in the DOM on the very first render — matters for crawler/validator
// runs that don't wait for the second tick.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <App />
      <Toaster />
    </React.StrictMode>
  </QueryClientProvider>
);
