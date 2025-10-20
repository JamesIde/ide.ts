import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <main className={GeistSans.className}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Analytics />
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "6b0b0bcf220c483a96bbc3d151bbf815"}'
          strategy="afterInteractive"
        />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN} />
      </QueryClientProvider>
    </main>
  );
}
