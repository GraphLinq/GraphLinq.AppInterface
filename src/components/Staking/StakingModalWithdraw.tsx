import React, { useState } from 'react'
import { chakra, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { ResponseSuccess } from '../../providers/responses/success';

interface StakingModalWithdrawProps {
    withdrawAmount: any
    stakingContract: any
    refreshBalance: any
}

export const StakingModalWithdraw: React.FC<StakingModalWithdrawProps> = (props: any) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");

    async function doWithdraw()
    {
        const asNumber: number = parseFloat(props.withdrawAmount)
        if (asNumber <= 0) {
            setError(`Invalid amount to withdraw from the balance contract: ${asNumber} GLQ`)
            return 
        }

        setPending("Pending, waiting for server response...")
        //const result: ResponseSuccess | String = await WalletService.withdraw(asNumber)
        const result: ResponseSuccess | String = await props.stakingContract.withdrawGlq()
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
            props.refreshBalance()
        }, 1000)
    }

        return (
            <>
                <button style={{marginTop: 20}} className="bt" onClick={onOpen}>Withdraw</button>
                <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside" isCentered>
                <ModalOverlay className="ov" />
                <ModalContent className="mod mod-cre">
                    <ModalHeader mt='0'>
                        <chakra.h1 color="#F4F1FF">Withdraw staked GLQ</chakra.h1>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody color="#B6ADD6" my="2rem">
                        Are you sure you want to withdraw all your staked GLQ ?
                    </ModalBody>
                    <ModalFooter className="fot">
                        <button className="bt" style={{padding: 15, fontSize: "15px"}} onClick={doWithdraw}>Yes, I'm sure</button>
                        <button style={{padding: 15, fontSize: "15px", fontWeight: 500}} onClick={onClose}>No, cancel</button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            </>
        );
}