import React, { useState } from "react";
import {
    Alert,
    Button,
    chakra,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Spinner,
    useDisclosure,
} from "@chakra-ui/react";
import { useActiveWeb3React } from "../../hooks/index";
import { ResponseSuccess } from "../../providers/responses/success";
import { useStakingContract } from "../../hooks/useContract";

interface StakingModalWithdrawProps {
    withdrawAmount: any;
    refreshBalance: any;
}

export const StakingModalWithdraw: React.FC<StakingModalWithdrawProps> = (props: any) => {
    const { account } = useActiveWeb3React();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");
    const stakingContract = useStakingContract(process.env.REACT_APP_STAKING_CONTRACT);

    async function doWithdraw() {
        try {
            if (props.withdrawAmount <= 0) {
                setError(`Invalid amount to withdraw from the staking contract: ${props.withdrawAmount} GLQ`);
                return;
            }

            setPending("Pending, waiting for server response...");
            if (stakingContract == null) {
                return;
            }
            const result = await stakingContract.withdrawGlq();
            setPending("Waiting for confirmations...");
            await result.wait();
            if (result instanceof String) {
                setPending("");
                setError(result.toString());
                return;
            }
            if (result.success) {
                setPending("");
                setError("");
                setSuccess(result.hash);
            }

            setTimeout(() => {
                props.refreshBalance();
            }, 1000);
        } catch (e) {
            if (e.data?.originalError.message) {
                setPending("");
                setError(`Error: ${e.data?.originalError.message}`);
                return;
            }
            if (e.message) {
                setPending("");
                setError(`Error: ${e.message}`);
            }
        }
    }

    return (
        <>
            <button style={{ marginTop: 20 }} className="bt" onClick={onOpen}>
                Withdraw
            </button>
            <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside" isCentered>
                <ModalOverlay className="ov" />
                <ModalContent className="mod mod-cre">
                    <ModalHeader mt="0">
                        <chakra.h1 color="#F4F1FF">Withdraw staked GLQ</chakra.h1>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody color="#B6ADD6" my="2rem">
                        {error && (
                            <Alert status="error" className="mod" py="2rem" px="3rem" mx="auto" mb="1rem">
                                <i className="fal fa-times-circle"></i>
                                <p>{error}</p>
                            </Alert>
                        )}
                        {!success && pending && (
                            <Alert status="info" className="mod" py="2rem" px="3rem" mx="auto" mb="1rem">
                                <i className="fal fa-info-circle"></i>
                                <p>{pending}</p>
                                <Spacer />
                                <Spinner thickness="2px" speed="0.65s" emptyColor="#15122b" color="blue.600" size="md" />
                            </Alert>
                        )}
                        {success && (
                            <Alert status="success" className="mod" py="2rem" px="3rem" mx="auto" mb="1rem">
                                <i className="fal fa-check-circle"></i>
                                <p>
                                    Deposit successfully completed !
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
                        Are you sure you want to withdraw all your staked GLQ ?
                    </ModalBody>
                    <ModalFooter className="fot">
                        <Button className="bt" style={{ padding: 15, fontSize: "15px" }} onClick={doWithdraw}>
                            Yes, I'm sure
                        </Button>
                        <Button colorScheme="base" style={{ padding: 15, fontSize: "15px", fontWeight: 500 }} onClick={onClose}>
                            No, cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
