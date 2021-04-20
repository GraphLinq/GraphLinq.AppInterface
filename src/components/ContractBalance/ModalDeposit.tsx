import React, { useState } from 'react'
import { Button, Icon, Text, Alert, AlertDescription, AlertIcon, AlertTitle, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, useDisclosure } from '@chakra-ui/react';
import { FiArrowUpRight } from 'react-icons/fi';
import { useBalanceContract, useTokenContract } from '../../hooks/useContract';
import { getDecimalsAmount } from '../../utils';
import { useActiveWeb3React } from '../../hooks';
import { utils } from 'ethers';
import { useBalance } from '../../hooks/useBalance';
import { useWalletContract } from '../../hooks/useWalletContract';

interface ModalDepositProps {

}

export const ModalDeposit: React.FC<ModalDepositProps> = ({ }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const finalRef = React.useRef()
    const contract = useBalanceContract(process.env.REACT_APP_GRAPHLINQ_BALANCE_CONTRACT);
    const tokenContract = useTokenContract(process.env.REACT_APP_GRAPHLINQ_TOKEN_CONTRACT)


    const {balance, refreshBalance} =  useBalance();
    const {refreshBalanceContract} =  useWalletContract();
    
    const { account } = useActiveWeb3React()
    const [amountDeposit, setAmountDeposit] = useState("0.0");
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");


    const format = (val: string) => val + ` GLQ`;
    const parse = (val: string) => val.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1');

    async function doDeposit()
    {
        if (contract == null || tokenContract == null) { return }
        refreshBalance()

        const asNumber: number = parseFloat(amountDeposit)
        if (asNumber <= 0) {
            setError(`Invalid amount to deposit on the balance contract: ${asNumber} GLQ`)
            return 
        }
        
        const decimalAmount: any = utils.parseEther(amountDeposit)
        try {
            const allowance = await tokenContract.allowance(account, process.env.REACT_APP_GRAPHLINQ_BALANCE_CONTRACT);
            const wei = utils.parseEther('10000000')
            if (parseFloat(allowance) < parseFloat(decimalAmount)) {
                console.log(`${allowance} vs ${decimalAmount}`)
                setPending("Allowance pending, please allow the use of your token balance for the contract...")
                const approveTx = await tokenContract.approve(process.env.REACT_APP_GRAPHLINQ_BALANCE_CONTRACT, wei.toString());
                setPending("Waiting for confirmations...")
                await approveTx.wait()
                setPending("Allowance successfully increased, waiting for deposit transaction...")
            }
            const currentBalanceDecimal: any = utils.parseEther(balance.amount.toString())
            if (parseFloat(decimalAmount) > parseFloat(currentBalanceDecimal)) {
                setPending(""); setError(`You only have ${balance.amount} GLQ in your wallet.`);
                return;
            }

            setPending("Pending, check your wallet extension to execute the chain transaction...")
            const result = await contract.addBalance(decimalAmount.toString())
            setPending("Waiting for confirmations...")
            await result.wait()
            setSuccess(result.hash)

            refreshBalanceContract()
        }
        catch (e)
        {
            console.error(e)
            if (e.data?.message) { setPending(""); setError(`Error: ${e.data?.message}`);return; }
            if (e.message) { setPending(""); setError(`Error: ${e.message}`); }
        }
    }

    return (
        <>
            <button className="sbt" ref={finalRef as any} onClick={onOpen}>Deposit <i className="fal fa-long-arrow-up"></i></button>
            <Modal finalFocusRef={finalRef as any} isOpen={isOpen} onClose={onClose} key="test" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader bgColor="brand.50" borderTopRadius="md">Deposit</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody bgColor="brand.100" borderBottomRadius="md">
                        <Stack spacing={3} p="4">
                            {error &&
                            <Alert status="error">
                                <AlertIcon />{error}
                            </Alert>
                            }
                            {!success && pending &&
                            <Alert status="info">
                                <AlertIcon />{pending}
                            </Alert>
                            }
                            {success &&
                             <Alert
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
                                    Deposit successfully completed !
                                </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    Transaction hash :
                            <Text fontSize="xs" isTruncated px="2">
                                        <a style={{color: 'blue'}} href={`https://etherscan.com/tx/${success}`} target="_blank">{success}</a>
                            </Text>
                                </AlertDescription>
                            </Alert>
                            }
                            <NumberInput
                                placeholder="GLQ Amount"
                                onChange={(value) => { setAmountDeposit(parse(value)) }}
                                value={format(amountDeposit)}
                                size="lg"
                                defaultValue={0}
                                min={0}
                                borderColor="brand.300"
                                focusBorderColor="brand.500"
                                step={0.1}>

                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper color="brand.500" />
                                    <NumberDecrementStepper color="brand.500" />
                                </NumberInputStepper>
                            </NumberInput>
                            <Button onClick={doDeposit} colorScheme="brand" size="lg"> Deposit</Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}