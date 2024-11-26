import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";

import { NetworkContextName } from "./constants/index";
import getLibrary from "./utils/getLibrary";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

// Function to check for Ethereum provider
const checkEthereumProvider = () => {
  const ethereum = (window as any)?.ethereum;
  if (ethereum) {
    // Safely access properties using optional chaining
    ethereum.autoRefreshOnNetworkChange = true;
    return true;
  } else {
    console.error("Ethereum provider (e.g., MetaMask) is not available.");
    alert("Please install MetaMask or another Ethereum wallet provider.");
    return false;
  }
};

// Run the check for Ethereum provider
if (!checkEthereumProvider()) {
  console.log("No Ethereum provider detected.");
}

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
