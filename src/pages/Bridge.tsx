import React, {useEffect, useState} from 'react'
import { Alert, Box, Grid, GridItem, Heading, Icon, createStandaloneToast, Spacer, Image } from '@chakra-ui/react';
import { HiArrowRight, HiArrowLeft, HiOutlineInformationCircle } from 'react-icons/hi';
import { useHistory } from 'react-router-dom';
import GLQLogoChain from "../assets/logo_chain.png"
;
interface BridgeProps {

}

const Bridge: React.FC<BridgeProps> = ({}) => {
    const history = useHistory();

    async function switchToGLQNetwork() {
        const windowObject: any = window;

        var res = windowObject.ethereum ? await windowObject.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
                chainId: '0x266',
                rpcUrls: ["https://glq-dataseed.graphlinq.io/"],
                chainName: "GraphLinq Chain Mainnet",
                nativeCurrency: {
                    name: "GLQ",
                    symbol: "GLQ",
                    decimals: 18
                },
                blockExplorerUrls: ['https://explorer.graphlinq.io/']
            }]
        }) : null;
    }

    async function switchToETHNetwork() {
        const windowObject: any = window;
        var res = windowObject.ethereum ? await windowObject.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }], // @TODO remove goerli
          }) : null;
    }

    async function goToBridgeIn() {
        //await switchToETHNetwork(); useless cause ppl are stuck if they refresh and already send for claiming
        history.push('/app/bridge/in');
    }

    async function goToBridgeOut() {
        //await switchToGLQNetwork(); useless cause ppl are stuck if they refresh and already send for claiming
        history.push('/app/bridge/out');
    }

    return (
        <Box className='bridge'  mx={{ sm: 'auto' }} w={{ sm: 'full' }}>
            <h1 className="tc">Bridge</h1>
            <Grid templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6}>
                <GridItem colSpan={1} rounded="xl" w="100%" minH="275" maxH="450px" bg="#15122b" p="1.5rem" display="flex" flexDirection="column">
                    <Box mx="auto" textAlign="center">
                        <Icon as={HiOutlineInformationCircle} color="#2334ff" w={8} h={8} />
                        <Heading size="md" color="#ece7fd" my="0.75rem">How to take your GLQ from ETH Network to GraphLinq Network ?</Heading>
                    </Box>
                    <div className="bridge-logos">
                        <svg width="20" height="20" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"></path><path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z"></path><path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"></path><path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"></path><path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z"></path><path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z"></path></svg>
                        <Icon as={HiArrowRight} color="#2334ff" w={8} h={8} />
                        <Image src={GLQLogoChain}/>
                    </div>
                    <Box mt="auto" mx="auto" textAlign="center">
                        <button className='bt' onClick={goToBridgeIn}>Bridge in my GLQ</button>
                    </Box>
                </GridItem>
                
                <GridItem colSpan={1} rounded="xl" w="100%" minH="275" maxH="450px" bg="#15122b" p="1.5rem" display="flex" flexDirection="column">
                    <Box mx="auto" textAlign="center">
                        <Icon as={HiOutlineInformationCircle} color="#2334ff" w={8} h={8} />
                        <Heading size="md" color="#ece7fd" my="0.75rem">How to take your GLQ from GraphLinq Network to ETH Network ?</Heading>
                    </Box>
                    <div className="bridge-logos">
                        <svg width="20" height="20" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"></path><path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z"></path><path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"></path><path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"></path><path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z"></path><path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z"></path></svg>
                        <Icon as={HiArrowLeft} color="#2334ff" w={8} h={8} />
                        <Image src={GLQLogoChain}/>
                    </div>
                    <Box mt="auto" mx="auto" textAlign="center">
                        <button className='bt' onClick={goToBridgeOut}>Bridge out my GLQ</button>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
}

export default Bridge;