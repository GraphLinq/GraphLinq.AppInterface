import React, {useEffect, useState} from 'react'
import { Alert, Box, InputGroup, NumberInput, NumberInputField, InputRightElement, Button, createStandaloneToast, Spacer, Spinner, LinkOverlay } from '@chakra-ui/react';
import { ToastSuccess } from "../components/Toasts/ToastSuccess";
import { ToastError } from "../components/Toasts/ToastError";
import { ToastWarning } from "../components/Toasts/ToastWarning";
import { ToastInfo } from "../components/Toasts/ToastInfo";
import { useActiveWeb3React } from "../hooks/index";
import { useBridgeInContract, useBridgeOutNativeContract, useTokenContract } from "../hooks/useContract";
import { useBalance } from "../hooks/useBalance";
import { utils, ethers } from "ethers";
import { log } from 'console';
import { add } from 'lodash';

interface BridgeOutProps {

}

const BridgeOut: React.FC<BridgeOutProps> = ({}) => {
    const { account, chainId, library } = useActiveWeb3React();

    const { balance, refreshBalance } = useBalance();
    const [balanceWallet, setBalanceWallet] = useState(0);
    
    const [amountToDepositFromGLQ, setAmountToDepositFromGLQ] = useState(0);
    const [amountToClaimFromETH, setAmountToClaimFromETH] = useState(0);
    const [amountClaimedFromETH, setAmountClaimedFromETH] = useState(0);

    const toast = createStandaloneToast();
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");

    const resetFeedback = () => {
        setError("");
        setPending("");
        setSuccess("");
    };

    const tokenContract = useTokenContract("0x9107E57C2BA29cf0b60f1E57c90210bE5F27E91e"); // @TODO remove goerli contract
    const bridgeInNativeContract = useBridgeInContract(process.env.REACT_APP_BRIDGE_IN_NATIVE_CONTRACT);
    const bridgeOutContract = useBridgeOutNativeContract(process.env.REACT_APP_BRIDGE_OUT_CONTRACT);

    const format = (val: string) => val + ` GLQ`;
    const parse = (val: string) => val.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1");

    const maxDeposit = () => {
        setAmountToDepositFromGLQ(balanceWallet);
    }

    const refreshBalanceWallet = async () => {
        const windowObject: any = window;
        const provider = new ethers.providers.Web3Provider(windowObject.ethereum);
        const balance = await provider.getBalance(account);
        setBalanceWallet(parseFloat(ethers.utils.formatEther(balance)));
    }

    async function doDeposit(e: any) {
        if (bridgeInNativeContract == null) {
            return;
        }

        try {
            setPending("Pending, check your wallet extension to execute the chain transaction...");
            toast({
                position: "bottom-right",
                render: () => <ToastWarning description="Pending, check your wallet extension to execute the chain transaction..." />,
            });
            const result = await bridgeInNativeContract.signer.sendTransaction({
                from: account,
                to: bridgeInNativeContract.address,
                value: ethers.utils.parseEther(amountToDepositFromGLQ.toString()),
            });
            setPending("Waiting for confirmations...");
            toast({
                position: "bottom-right",
                render: () => <ToastInfo description="Waiting for confirmations..." />,
            });
            const txReceipt = await result.wait();
            if (txReceipt.status === 1) {
                setSuccess(txReceipt.transactionHash);
                toast({
                    position: "bottom-right",
                    render: () => <ToastSuccess title="Deposit successfully completed !" description={txReceipt.transactionHash} isLink />,
                });
            }

            refreshBalance();

            switchToETHNetwork();
        } catch (e) {
            //console.error(e);
            if (e.data?.message) {
                setPending("");
                setError(`Error: ${e.data?.message}`);
                toast({
                    position: "bottom-right",
                    render: () => <ToastError description={e.data?.message} />,
                });
                return;
            }
            if (e.message) {
                setPending("");
                setError(`Error: ${e.message}`);
                toast({
                    position: "bottom-right",
                    render: () => <ToastError description={e.message} />,
                });
            }
        }
    }

    async function doClaim(e: any)
    {
        e.preventDefault();
        resetFeedback();
        try {
            const result = await bridgeOutContract.withdrawBridged();
            setPending("Waiting for 2 confirmations...");
            const txReceipt = await library.waitForTransaction(result.hash, 2);
            if (txReceipt.status === 1) {
                resetFeedback();
                setSuccess(txReceipt.transactionHash);
            }
            refreshBalance();
        } catch (e: any) {
            resetFeedback();
            if (e && e?.data?.message !== undefined) {
                setError(`${e.data.message}`);
            } else if (e && e.message) {
                setError(`${e.message}`);
            } else {
                setError(`Error: ${e}`);
            }
        }
    }

    async function switchToGLQNetwork() {
        resetFeedback();
        const windowObject: any = window;

        var res = windowObject.ethereum ? await windowObject.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
                chainId: '0x266',
                rpcUrls: ["https://node1.graphlinq.io/","https://node2.graphlinq.io/","https://node3.graphlinq.io/"],
                chainName: "GraphLinq Network",
                nativeCurrency: {
                    name: "GLQ",
                    symbol: "GLQ",
                    decimals: 18
                }
            }]
        }) : null;
    }

    async function switchToETHNetwork() {
        resetFeedback();
        const windowObject: any = window;
        var res = windowObject.ethereum ? await windowObject.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x5' }], // @TODO remove goerli
          }) : null;
    }

    useEffect(() => {
        const fetchData = async () => {
            if (chainId !== 5) {
                return;
            }
    
            const addrInfo = await bridgeOutContract.getAddressInfos(account);
            console.log(addrInfo);
    
            const total = parseFloat(utils.formatUnits(addrInfo[0], 18))
            const alreadyClaimed = parseFloat(utils.formatUnits(addrInfo[1], 18))
            const leftToClaim = total - alreadyClaimed;

            setAmountClaimedFromETH(alreadyClaimed);
            setAmountToClaimFromETH(leftToClaim);
        }
        fetchData();
        refreshBalanceWallet();
    })

    return (
        <Box className='bridge' maxW={{ sm: 'xl' }} mx={{ sm: 'auto' }} w={{ sm: 'full' }}>
            {chainId === parseInt(process.env.REACT_APP_GLQ_CHAIN_ID) && (
                <>
                    <h1 className="tc">Bridge your GLQ tokens from GraphLinq Network to ETH Network</h1>
                    <Box className="priv">
                        <p className='bridge-desc'>
                            You first need to deposit your GLQ by switching to GraphLinq Network over Metamask 
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 318.6 318.6" stroke-linejoin="round" width="20"><path d="M274.1 35.5l-99.5 73.9L193 65.8z" fill="#e2761b" stroke="#e2761b"></path><g fill="#e4761b" stroke="#e4761b"><path d="M44.4 35.5l98.7 74.6-17.5-44.3zm193.9 171.3l-26.5 40.6 56.7 15.6 16.3-55.3z"></path><path d="M33.9 207.7L50.1 263l56.7-15.6-26.5-40.6zm69.7-69.5l-15.8 23.9 56.3 2.5-2-60.5z"></path><path d="M214.9 138.2l-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5l33.9 16.5-4.7-39.3z"></path></g><path d="M211.8 247.4l-33.9-16.5 2.7 22.1-.3 9.3zm-105 0l31.5 14.9-.2-9.3 2.5-22.1z" fill="#d7c1b3" stroke="#d7c1b3"></path><path d="M138.8 193.5l-28.2-8.3 19.9-9.1zm40.9 0l8.3-17.4 20 9.1z" fill="#233447" stroke="#233447"></path><path d="M106.8 247.4l4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7l-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1l20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z" fill="#cd6116" stroke="#cd6116"></path><path d="M87.8 162.1l23.6 46-.8-22.9zm120.3 23.1l-1 22.9 23.7-46zm-64-20.6l-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0l-2.7 18 1.2 45 6.7-34.1z" fill="#e4751f" stroke="#e4751f"></path><path d="M179.8 193.5l-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3l.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z" fill="#f6851b" stroke="#f6851b"></path><path d="M180.3 262.3l.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z" fill="#c0ad9e" stroke="#c0ad9e"></path><path d="M177.9 230.9l-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z" fill="#161616" stroke="#161616"></path><path d="M278.3 114.2l8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z" fill="#763d16" stroke="#763d16"></path><path d="M267.2 153.5l-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3l-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4l3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z" fill="#f6851b" stroke="#f6851b"></path></svg>
                            and then switch to 
                            <svg width="20" height="20" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"></path><path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z"></path><path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"></path><path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"></path><path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z"></path><path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z"></path></svg>
                            ETH Network to claim back your tokens.
                        </p>
                        <form>
                            {error && (
                                <Alert status="error" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                                    <i className="fal fa-times-circle"></i>
                                    <p>{error}</p>
                                </Alert>
                            )}
                            {!success && pending && (
                                <Alert status="info" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                                    <i className="fal fa-info-circle"></i>
                                    <p>{pending}</p>
                                    <Spacer />
                                    <Spinner thickness="2px" speed="0.65s" emptyColor="#15122b" color="blue.600" size="md" />
                                </Alert>
                            )}
                            {success && (
                                <Alert status="success" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                                    <i className="fal fa-check-circle"></i>
                                    <p>
                                        Successfully completed !
                                        <br />
                                        <small>
                                            Transaction hash :{" "}
                                            <a href={`https://etherscan.com/tx/${success}`} target="_blank">
                                                {success}
                                            </a>
                                        </small>
                                    </p>
                                </Alert>
                            )}

                            <div>
                                <InputGroup rounded="full">
                                    <NumberInput
                                        className="in"
                                        placeholder="0.00"
                                        variant="unstyled"
                                        onChange={(value) => {
                                            parse(value);
                                            setAmountToDepositFromGLQ(parseFloat(value));
                                        }}
                                        value={format(amountToDepositFromGLQ.toString())}
                                        defaultValue={0.0}
                                        min={0.0}
                                    >
                                        <NumberInputField formNoValidate={true} />
                                    </NumberInput>
                                    <InputRightElement width="4.5rem" top="50%" transform="translateY(-50%)">
                                        <Button rounded="full" colorScheme="blackAlpha" h="1.75rem" size="sm" onClick={maxDeposit}>
                                            Max
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </div>
                            <div className="bt" onClick={doDeposit}>
                                Deposit GLQ from GraphLinq Network
                            </div>
                        </form>
                    </Box>
                    <button className='bt' onClick={switchToETHNetwork}>
                        Switch to ETH Network
                    </button>
                </>
            )}
            {chainId === 5 && (
                <>
                    <h1 className="tc">Claim your GLQ tokens from ETH Network</h1>
                    <Box className="priv">
                        <p className='bridge-desc'>
                            You may now claim your tokens on the ETH Network.
                        </p>
                        <form>
                            {error && (
                                <Alert status="error" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                                    <i className="fal fa-times-circle"></i>
                                    <p>{error}</p>
                                </Alert>
                            )}
                            {!success && pending && (
                                <Alert status="info" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                                    <i className="fal fa-info-circle"></i>
                                    <p>{pending}</p>
                                    <Spacer />
                                    <Spinner thickness="2px" speed="0.65s" emptyColor="#15122b" color="blue.600" size="md" />
                                </Alert>
                            )}
                            {success && (
                                <Alert status="success" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                                    <i className="fal fa-check-circle"></i>
                                    <p>
                                        Successfully completed !
                                        <br />
                                        <small>
                                            Transaction hash :{" "}
                                            <a href={`https://etherscan.com/tx/${success}`} target="_blank">
                                                {success}
                                            </a>
                                        </small>
                                    </p>
                                </Alert>
                            )}

                            <div>
                                <InputGroup rounded="full">
                                    <NumberInput
                                        className="in"
                                        placeholder="0.00"
                                        variant="unstyled"
                                        value={format(amountToClaimFromETH.toString())}
                                    >
                                        <NumberInputField />
                                    </NumberInput>
                                </InputGroup>
                            </div>
                            <button className="bt" disabled={amountToClaimFromETH <= 0} onClick={doClaim}>
                                Claim GLQ from ETH Network
                            </button>

                            <Alert status="info" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                                <i className="fal fa-info-circle"></i>
                                <p>
                                    Total already claimed: <span style={{fontSize:18, fontWeight:"bold"}}>{amountClaimedFromETH} GLQ</span>
                                </p>
                            </Alert>
                        </form>
                    </Box>
                    <button className='bt' onClick={switchToGLQNetwork}>
                        Switch to GraphLinq Network
                    </button>
                </>
            )}
        </Box>
    );
}

export default BridgeOut;