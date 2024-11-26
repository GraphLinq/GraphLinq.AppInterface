import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";

import { NetworkContextName } from "./constants/index";
import getLibrary from "./utils/getLibrary";

import { ChakraProvider, ColorModeScript, Box, Text, Button } from "@chakra-ui/react";
import theme from "./theme";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

const Root = () => {
  const [isEthereumAvailable, setIsEthereumAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const ethereum = (window as any)?.ethereum;
    if (ethereum) {
      ethereum.autoRefreshOnNetworkChange = true;
      setIsEthereumAvailable(true);
    } else {
      setIsEthereumAvailable(false);
    }
  }, []);

  return (
    <React.StrictMode>
      <ColorModeScript />
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <ChakraProvider theme={theme}>
            {isEthereumAvailable === null && (
              <Box textAlign="center" mt="4">
                <Text>Checking for Ethereum provider...</Text>
              </Box>
            )}
            {isEthereumAvailable === false && (
              <Box textAlign="center" mt="4">
                <Text fontSize="lg" color="red.500">
                  Ethereum provider (e.g., MetaMask) is not available.
                </Text>
                <Text mt="2">
                  Please install <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a> or another Ethereum wallet provider to use this application.
                </Text>
              </Box>
            )}
            {isEthereumAvailable === true && <App />}
          </ChakraProvider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </React.StrictMode>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
