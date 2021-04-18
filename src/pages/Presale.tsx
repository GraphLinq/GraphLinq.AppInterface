import { Alert, AlertTitle, AlertDescription, AlertIcon, Box, Button, Divider, Flex, Heading, Input, Progress, Spacer, Stat, StatHelpText, StatLabel, StatNumber, Text, useClipboard, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { usePresaleContract } from '../hooks/useContract';
import { useWeb3React } from "@web3-react/core";
import { getDecimalsAmount } from '../utils';
import { utils } from 'ethers';
import ManagerProvider from '../providers/manager';

interface PresaleProps {

}

const GLQRate = 715000

const Presale: React.FC<PresaleProps> = ({ }) => {

    const [value, setValue] = React.useState("");
    const [access, setAccess] = React.useState(true);
    const [error, setError] = React.useState("");
    const [pending, setPending] = React.useState("");
    const [success, setSuccess] = React.useState("");

    const handleChange = (event: any) => setValue(event.target.value)
    const checkAccess = async () => {
        const data = await ManagerProvider.checkPresalePwd(value)
        console.log(data)
        if (data.success) {
            setError("")
            setAccess(true)
        } else {
            setError("Invalid password access for the Private Sale round, please try again.")
        }
    };


    const { account } = useWeb3React();
    const contract = usePresaleContract(process.env.REACT_APP_PRIVATE_PRESALE_CONTRACT);
    const [addr, setAddr] = React.useState(process.env.REACT_APP_PRIVATE_PRESALE_CONTRACT ?? "")
    const { hasCopied, onCopy } = useClipboard(addr)
    const [raised, setRaised] = React.useState(0)
    const [invested, setInvested] = React.useState(0)
    const [progressRaise, setProgressRaise] = React.useState(0)


    useEffect(() => {
        const refreshRaisedFunds = async () => {
            if (contract == null || !access) return
            try {
                const currentRaised = await contract.getTotalRaisedEth()
                const amount = Number(utils.formatUnits(currentRaised.toString(), 'ether'))
                const progress = (amount / 70) * 100

                const currentInvestment = await contract.getAddressInvestment(account)
                const amountInvested = Number(utils.formatUnits(currentInvestment.toString(), 'ether'))
                
                setRaised(Number(amount))
                setInvested(Number(amountInvested))
                setProgressRaise(progress)
            } catch (e) { console.error(e) }

            setTimeout(refreshRaisedFunds, 10000)
        }
        refreshRaisedFunds()

    }, [account, access])
    
    const claimToken = async () => {
        if (contract == null || !access) return
        setError(""); setSuccess("");
        try {
            setPending("Pending, check your wallet extension to execute the chain transaction...")
            const result = await contract.claimGlq({from: account})
            setPending("Waiting for Ethereum confirmations...")
            await result.wait()
            setSuccess(result.hash)
        }
        catch (e)
        {
            if (e.data?.message) { setPending(""); setError(`Error: ${e.data?.message}`);return; }
            if (e.error?.message) {
                setPending(""); setError(`Error: ${e.error.message}`); return;}
            if (e.message) { setPending(""); setError(`Error: ${e.message}`); }
        }
    }

    return (
        <>
        {error &&
            <Alert style={{marginTop: 20}} status="error">
                <AlertIcon />
                <Box
                    target="_blank"
                    as="a"
                    marginStart="1"
                    textColor="gray.700"
                    _hover={{ textColor: "gray.900", textDecoration: "underline" }}
                    display={{ base: 'block', sm: 'revert' }}
                >{error}</Box>
            </Alert>}

            {!success && pending &&
            <Alert style={{marginTop: 20}}status="info">
                <AlertIcon />{pending}
            </Alert>
            }
            {success &&
                <Alert style={{marginTop: 20}}
                status="success"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
            >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                    You successfully claimed your GLQ tokens from the Private sale, Congratulations!
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                    Transaction hash :
            <Text fontSize="xs" isTruncated px="2">
                        <a style={{color: 'blue'}} href={`https://etherscan.com/tx/${success}`} target="_blank">{success}</a>
            </Text>
                </AlertDescription>
            </Alert>
            }

            <Alert style={{marginTop: 20, fontWeight: 600}}status="error" variant="left-accent" whiteSpace="pre-wrap">
                    <AlertIcon />
                    <i>The presale is ended and the smart-contract do not accept any more transactions, do not send Ethereum, 
                    you can buy GLQ from <a style={{color: 'blue'}} target="_blank" href="https://app.uniswap.org/#/swap?inputCurrency=0x9F9c8ec3534c3cE16F928381372BfbFBFb9F4D24">Uniswap</a> or any of our listed CEXs.</i>
                </Alert>

            <Box bg='gray.50' h="max" py="12" px={{ sm: '6', lg: '8' }}>
                <Box maxW={{ sm: 'xl' }} mx={{ sm: 'auto' }} mt="8" w={{ sm: 'full' }}>
                    <Box
                        bg='white'
                        py="8"
                        shadow="base"
                        rounded={{ sm: 'lg' }}
                        border="1px"
                        borderColor={access ? "brand.300" : "brand.500"}
                    >
                        <Heading textAlign="center" size="lg" fontWeight="bold" textColor="gray.700">
                            {access ? "Private Pre-sale Round" : "Private Pre-sale Round Access"}
                        </Heading>
                        <Box px={8} mt="8" maxW="xl" align="center" hidden={access}>
                            <Text fontWeight="medium" textColor="gray.600" textAlign="left">
                                Enter the pre-sale access code :
                            </Text>
                            <Flex mt={2}>
                                <Input
                                    focusBorderColor="brand.400"
                                    type="password"
                                    value={value}
                                    onChange={handleChange}
                                />
                                <Button
                                    colorScheme="brand"
                                    variant="solid"
                                    ml={2}
                                    onClick={checkAccess}
                                >
                                    Access
                            </Button>
                            </Flex>
                        </Box>
                        <VStack
                            spacing={4}
                            align="stretch"
                            px={8}
                            mt="8"
                            mx="auto"
                            maxW="xl"
                            hidden={!access}
                        >
                            <Flex bgGradient="linear(to-r, indigo.500,brand.500)" rounded="md" px={2} py={4} align="center">
                                    <Box textColor="white" ml={2}>
                                    <Text  fontWeight="medium">Claim GLQ Token</Text>
                                    <Divider my={2} />
                                    <Text mb={1} fontSize="sm">You can claim <Box as="span" fontSize="md" fontWeight="high">{(invested *  GLQRate).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} GLQ = {invested} ETH </Box></Text>
                                    <Text fontSize="sm" textColor="gray.200">After sending ETH to the Presale Contract, Claim your GLQ Token (will be released at Uniswap listing time).</Text>
                                </Box>
                                <Spacer />
                                <Button
                                flexShrink={0}
                                    size="md"
                                    colorScheme="whiteAlpha"

                                    variant="solid"
                                    px={4}
                                    mr={2}
                                    rounded="full"
                                    onClick={claimToken}
                                >
                                    Claim Token
                            </Button>
                            </Flex>
                            <Stat border="1px" borderColor="gray.200" bgColor="gray.50" px="4" py="2" rounded="lg">
                                <StatLabel>1 ETH equals</StatLabel>
                                <StatNumber>~ {GLQRate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} GLQ</StatNumber>
                                <StatHelpText>~ 0.002464$ per GLQ</StatHelpText>
                            </Stat>
                            <Alert status="warning" rounded="lg" colorScheme="brand">
                                <AlertIcon />
                                Limited to 1 ETH per wallet
                            </Alert>
                            <Text fontSize="md" fontWeight="medium" textColor="gray.600" textAlign="left">
                                The below address is the contract hosted on ETH network for our private presale,
                                you can send ETH on it and will receive automatically the GLQ back.
                            </Text>
                            <Divider />
                            <span style={{ paddingTop: 10, float: 'right', color: 'blue' }}>
                                <a target="_blank" href="https://graphlinq.io/Cybersecurity_Audit_CTDSEC_GraphLinq_Presale.pdf">
                                    &gt; Review the full contract audit here
                                    </a>
                                <a style={{marginLeft: "4rem"}} target="_blank" href="https://github.com/GraphLinq/GraphLinq/blob/master/NodeBlock.GraphLinqPrivateSaleContract/contracts/GraphLinqPrivateSale.sol">
                                    &gt; View contract github
                                    </a>
                            </span>
                                <Flex>
                                <Input variant="flushed" value={addr} focusBorderColor="brand.400" isReadOnly />
                                <Button onClick={onCopy} variant="outline" ml={2}>
                                    {hasCopied ? "Copied" : "Copy"}
                                </Button>
                            </Flex>
                            <Box>
                                <Progress value={progressRaise} height="32px" colorScheme="brand" rounded="md" />
                                <Text align="center" color="gray.600">
                                    <b>{raised} / 70</b> ETH raised.
                                </Text>
                            </Box>
                            <Text align="center" color="gray.500">
                                Do not send ETH from exchange address or you may lose your GLQ token!
                            </Text>
                            {/* <Alert status="error" rounded="lg">
                                <AlertIcon />
                                Do not send ETH from exchange address or you may lose your GLQ token!
                            </Alert> */}
                        </VStack>
                    </Box>
                    <Alert style={{marginBottom: 20}} status="warning" rounded="lg" my="4" maxW="xl" mx="auto">
                        <AlertIcon />
                        <Box
                            target="_blank"
                            as="a"
                            marginStart="1"
                            href="https://docs.graphlinq.io/token/3-tokenomics"
                            textColor="gray.700"
                            _hover={{ textColor: "gray.900", textDecoration: "underline" }}
                            display={{ base: 'block', sm: 'revert' }}
                        >Read our documentation to learn more about the pre-sale process.</Box>
                    </Alert>
                </Box>
            </Box>
        </>
    );
}

export default Presale;