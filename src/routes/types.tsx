// @ts-nocheck
import { Route } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import WalletService from "../services/walletService";
import { useHistory } from "react-router-dom";
import AuthComponent from "../pages/Auth"

export const CustomRoute = ({ component, ...rest }: any) => {
  const { account } = useWeb3React();
  const history = useHistory();

  useEffect(() => {
    if (!account) { return }
    if (!WalletService.verifySessionIntegrity(account)) {
      return history.push("/");
    }
  }, [account, history])
  return (
    <Route
      {...rest}
      render={(props) =>
        account === undefined || localStorage.getItem("session") == null ? (
          React.createElement(AuthComponent, props)
        ) : (
          React.createElement(component, props)
        )
      }
    />
  );
};