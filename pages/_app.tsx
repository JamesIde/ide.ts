import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-GHS0468GG6" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', 'G-GHS0468GG6');
          `}
        </Script>
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "6b0b0bcf220c483a96bbc3d151bbf815"}'
          strategy="afterInteractive"
        />
        <Toaster />
        <Component {...pageProps} />
        <Analytics />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
