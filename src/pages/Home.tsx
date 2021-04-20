import React, { Suspense, useEffect, Fragment } from 'react'
import { Alert, AlertIcon, Grid, Heading } from '@chakra-ui/react';

interface HomeProps {

}

const Home: React.FC<HomeProps> = ({}) => {
    useEffect(() => {
        let vendor = document.createElement("script")
        vendor.src = 'https://widgets.coingecko.com/coingecko-coin-price-chart-widget.js'
        document.body.appendChild(vendor)
        setTimeout(() => {
            if(document.querySelector("coingecko-coin-compare-chart-widget") == null) {
                this.waitForApplyWidgetStyle();
                return;
            }
            const host = document.querySelector("coingecko-coin-compare-chart-widget").shadowRoot;
            if(host == null || host.querySelector(".highcharts-background") == null) {
                this.waitForApplyWidgetStyle();
                return;
            }
            var sheet = new CSSStyleSheet
            sheet.replaceSync( `.cg-container { background-color: rgb(43 49 79); border: none; } 
                .highcharts-title { color: white !important; fill: white !important; }
                .highcharts-button-normal text { fill: white !important; }
                .cg-linear-button rect { fill: #d02fb6 !important; }
                .cg-primary-color-dark { color: #d02fb6 !important; }`)
            host.adoptedStyleSheets = [ sheet ];
            host.querySelector(".highcharts-background").setAttribute("fill", "none");
            host.querySelector(".highcharts-button-pressed rect").setAttribute("fill", "#d02fb6");
            host.querySelector(".highcharts-scrollbar").setAttribute("display", "none");
            host.querySelector(".cg-container .cg-widget .cg-absolute").style.display = "none";
        }, 10)
    }, [])
    return (
        <Fragment>
            <h1>Home page</h1>
            <div dangerouslySetInnerHTML={{
                __html: '<coingecko-coin-price-chart-widget  coin-id="graphlinq-protocol" currency="usd" height="300" locale="fr"></coingecko-coin-price-chart-widget>'
            }}></div>
            <Alert status="info">
                <i className="fal fa-info-circle"></i> Welcome on the Beta release of the GraphLinq Protocol interface!
            </Alert>
        </Fragment>
    );
}

export default Home;