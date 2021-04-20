import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';

import { NetworkContextName } from './constants/index';
import getLibrary from './utils/getLibrary';

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

if ('ethereum' in window) {
  (window as any).ethereum.autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <React.StrictMode>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
