import React, { Suspense, useEffect, Fragment } from 'react'
import { Alert, AlertIcon, Grid, Heading } from '@chakra-ui/react';

interface HomeProps {

}

const Home: React.FC<HomeProps> = ({}) => {
    const applyCss = () => {
        setTimeout(() => {
            if(document.querySelector("coingecko-coin-compare-chart-widget") == null) {
                applyCss()
                return;
            }
            const host = (document as any).querySelector("coingecko-coin-compare-chart-widget").shadowRoot;
            if(host == null || host.querySelector(".highcharts-background") == null) {
                applyCss()
                return;
            }
            var sheet = new CSSStyleSheet
            // (sheet as any).replaceSync( `.cg-container { background-color: rgb(43 49 79); border: none; } 
            //     .highcharts-title { color: white !important; fill: white !important; }
            //     .highcharts-button-normal text { fill: white !important; }
            //     .cg-linear-button rect { fill: #d02fb6 !important; }
            //     .cg-primary-color-dark { color: #d02fb6 !important; }`)
            host.adoptedStyleSheets = [ sheet ];
            host.querySelector(".highcharts-background").setAttribute("fill", "none");
            host.querySelector(".highcharts-button-pressed rect").setAttribute("fill", "#d02fb6");
            host.querySelector(".highcharts-scrollbar").setAttribute("display", "none");
            host.querySelector(".cg-container .cg-widget .cg-absolute").style.display = "none";
        }, 10)
    }


    window.addEventListener('resize', () =>{  
        setTimeout(() => {applyCss()}, 100)
    })

    useEffect(() => {
        let vendor = document.createElement("script")
        vendor.src = 'https://widgets.coingecko.com/coingecko-coin-compare-chart-widget.js'
        document.body.appendChild(vendor)

        applyCss()

    }, [])
    return (
        <Fragment>
            <h1>Home page</h1>
            <Alert status="info">
                <i className="fal fa-info-circle"></i> Welcome on the Beta release of the GraphLinq Protocol interface!
            </Alert>

            <div dangerouslySetInnerHTML={{
                __html: '<coingecko-coin-compare-chart-widget coin-ids="graphlinq-protocol" currency="usd" locale="us"></coingecko-coin-compare-chart-widget>'
            }}></div>

        </Fragment>
    );
}

export default Home;