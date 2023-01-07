import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics
        trackPageViews
        gaMeasurementId={process.env.NEXT_PUBLIC_GOOGLE_GTAG}
      />
      <Component {...pageProps} />
    </>
  );
}
