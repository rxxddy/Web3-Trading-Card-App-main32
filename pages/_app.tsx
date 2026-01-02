import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { Analytics } from '@vercel/analytics/react';

import {

  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  trustWallet,
  darkTheme,
} from "@thirdweb-dev/react";
const activeChain = "polygon";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider 
      activeChain={activeChain}
      // clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      clientId="9e4314f9cb80713a98f3221cfb883eaf"
      
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        coinbaseWallet(),
        walletConnect(),
        trustWallet(),
      ]}
    >
      <Navbar />
      <Component {...pageProps} />
      <Analytics />
    </ThirdwebProvider>
  );
}

export default MyApp;
