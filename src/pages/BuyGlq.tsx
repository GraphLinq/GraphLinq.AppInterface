import React from 'react'
import transakSDK from '@transak/transak-sdk'
import { useWeb3React } from "@web3-react/core";

interface BuyGlqProps {

}

const BuyGlq: React.FC<BuyGlqProps> = ({ }) => {

    const { account } = useWeb3React();

    let transak = new transakSDK({
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY,  // Your API Key
        environment: process.env.REACT_APP_TRANSAK_ENV, // STAGING/PRODUCTION
        defaultCryptoCurrency: 'GLQ',
        walletAddress: account, // Your customer's wallet address
        themeColor: '2334ff', // App theme color
        fiatCurrency: '', // INR/GBP
        email: '', // Your customer's email address
        redirectURL: '',
        hostURL: window.location.origin,
        widgetHeight: '550px',
        widgetWidth: '450px'
    });
    
    transak.init();
    
    // To get all the events
    transak.on(transak.ALL_EVENTS, (data: any) => {
        console.log(data)
    });
    
    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData: any) => {
        console.log(orderData);
        transak.close();
    });

    return (
        <>
            <h1>Buy GLQ with FIAT</h1>
        </>
    );
}

export default BuyGlq;