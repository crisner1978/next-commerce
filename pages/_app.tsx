import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppProviders from "../components/AppProviders";
import { RecoilRoot } from "recoil";
import ProgressBar from "@badrap/bar-of-progress";
import { Router } from "next/router";

const progress = new ProgressBar({
  size: 4,
  color: "#2563eb",
  className: "z-50",
  delay: 80,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AppProviders>
        <Component {...pageProps} />
      </AppProviders>
    </RecoilRoot>
  );
}

export default MyApp;
