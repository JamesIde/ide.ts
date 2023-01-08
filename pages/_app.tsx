import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Script from "next/script";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
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
        <Component {...pageProps} />
      </GoogleOAuthProvider>
    </>
  );
}
