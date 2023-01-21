import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOAUTH_ID}>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-GHS0468GG6"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', 'G-GHS0468GG6');
          `}
          </Script>
          <Toaster />
          <Component {...pageProps} />
          <Analytics />
          <ReactQueryDevtools initialIsOpen={false} />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </>
  );
}
