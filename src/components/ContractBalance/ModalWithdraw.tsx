import React, { useState, useEffect } from 'react'
import { Button, Icon, Text, Alert, AlertDescription, AlertIcon, AlertTitle, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, useDisclosure } from '@chakra-ui/react';
import { FiArrowDownLeft } from 'react-icons/fi';
import { useActiveWeb3React } from '../../hooks';
import WalletService from '../../services/walletService';
import { ResponseSuccess } from '../../providers/responses/success';
import { useWalletContract } from '../../hooks/useWalletContract';

interface ModalWithdrawProps {

}

export const ModalWithdraw: React.FC<ModalWithdrawProps> = ({ }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const finalRef = React.useRef()
    const { account } = useActiveWeb3React()
    const [dueBalance, setDueBalance] = useState(0)
    const [amountWithdraw, setAmountWithdraw] = useState("0.0");
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");

    const {refreshBalanceContract} =  useWalletContract();

    const format = (val: string) => val + ` GLQ`;
    const parse = (val: string) => val.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1');

    useEffect(() => {
        const getCloudBalance = async () => {
            try {
                const result = await WalletService.getBalance(account ?? "")
                if (result?.due_balance) {
                    setDueBalance(result.due_balance)
                }
            } catch (e) {
                console.error(e)
            }
        }
        getCloudBalance()
    }, [account])

    async function doWithdraw()
    {
        const asNumber: number = parseFloat(amountWithdraw)
        if (asNumber <= 0) {
            setError(`Invalid amount to withdraw from the balance contract: ${asNumber} GLQ`)
            return 
        }

        setPending("Pending, waiting for server response...")
        const result: ResponseSuccess | String = await WalletService.withdraw(asNumber)
        if (result instanceof String) {
            setPending(""); setError(result.toString());
            return;
        }
        if (result.success) {
            setPending("")
            setError("")
            setSuccess(result.hash)
        }

        setTimeout(() => {
            refreshBalanceContract()
        }, 1000)
    }

    return (
        <>
            <Button ref={finalRef as any} onClick={onOpen} rightIcon={<Icon as={FiArrowDownLeft} />}>Withdraw</Button>
            <Modal finalFocusRef={finalRef as any} isOpen={isOpen} onClose={onClose} key="test" isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader bgColor="brand.50" borderTopRadius="md">Withdraw</ModalHeader>
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
                                    Withdraw successfully completed !
                                </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    Transaction hash :
                            <Text fontSize="xs" isTruncated px="2">
                                        <a style={{color: 'blue'}} href={`https://etherscan.com/tx/${success}`} target="_blank">{success}</a>
                            </Text>
                                </AlertDescription>
                            </Alert>
                            }
                            <Alert
                                status="info"
                                variant="subtle"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                height="200px"
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertDescription maxWidth="sm">
                                    <div style={{paddingTop: 20}}>
                                        You currently have <b>{dueBalance} GLQ</b> of execution cost from executed graphs to burn.
                                    </div>
                                </AlertDescription>
                            </Alert>
                            <NumberInput
                                placeholder="GLQ Amount"
                                onChange={(value) => { setAmountWithdraw(parse(value)) }}
                                value={format(amountWithdraw)}
                                size="lg"
                                defaultValue={0}
                                min={0}
                                borderColor="brand.300"
                                focusBorderColor="brand.500"
                                step={0.1}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper color="brand.500" />
                                    <NumberDecrementStepper color="brand.500" />
                                </NumberInputStepper>
                            </NumberInput>
                            <Button onClick={doWithdraw} colorScheme="brand" size="lg">Withdraw</Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}