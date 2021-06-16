import React from "react";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Input } from "@chakra-ui/react";

interface WalletCreationProps {}

export const WalletCreation: React.FC<WalletCreationProps> = ({}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const createWallet = () => {
        console.log('create wallet')
    }

    return (
        <>
            <Button className="bt" onClick={onOpen}>
                Create Wallet <i className="fal fa-plus"></i>
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg="linear-gradient(to bottom, #1d1938, #15122b)" rounded="xl" size="xl">
                    <ModalHeader color="">Create Wallet :</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Wallet Name :</FormLabel>
                            <Input variant="unstyled" bgColor="#090812" h="1.5rem" py="0.5rem" px="1rem" rounded="xl" type="text" />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button className="bt" mr={3} onClick={createWallet}>
                            Create
                        </Button>
                        <Button variant="blackAlpha" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
