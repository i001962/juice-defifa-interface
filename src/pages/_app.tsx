import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "reactjs-popup/dist/index.css";
import "styles/globals.css";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { http } from "viem";

const config = getDefaultConfig({
  appName: "Defifa",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "defifa-temp-project-id",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(`https://sepolia.infura.io/v3/0f1ad790aeba4625b4d967858d7c33d0`),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({ accentColor: "#7c3aed" })}
        >
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
                 {/* <div className="text-center p-0.5 bg-yellow-500 text-black text-xs font-medium">
                   EXPERIMENTAL GAMES - USE ON SEPOLIA - REPORT BUGS
                 </div> */}
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
