import React from "react";
import { Text, Button, Box, Spacer, Icon, useClipboard } from "@chakra-ui/react";
import { WalletCreation } from "../components/Wallets/WalletCreation";
import { HiOutlineClipboardCopy } from "react-icons/hi";

interface WalletsProps {}

const Wallets: React.FC<WalletsProps> = ({}) => {
    const publicKey = ""
    const { hasCopied, onCopy } = useClipboard(publicKey)
    return (
        <>
            <h1>
                My Wallets
                <WalletCreation />
            </h1>
            <Box display="flex" alignItems="center" w="full" px="4" py="6" rounded="lg">
                <Box display="flex" width="25%" px={2}>Wallet name</Box>
                <Box display="flex" width={["30%", "55%"]} px={2}>Address</Box>
                <Spacer />
                <Box display="flex" width={["10%", "20%"]} px={2}>
                    Public Key
                </Box>
                <Spacer />
                <Box display="flex" width="10%" px={2}>Ether Amount</Box>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" bg="linear-gradient(to bottom, #1d1938, #15122b)" w="full" px="4" py="6" rounded="lg">
                <Box display="flex" width="25%" px={2}>WALLET 01 NAME</Box>
                <Box display="flex" width={["30%", "55%"]} px={2}>
                    <Text isTruncated>
                    0xeB4A6F3d8154A18aD312692eCFE4eeF8Fde66439
                    </Text>
                </Box>
                <Spacer />
                <Box display="flex" width={["10%", "20%"]} px={2}>
                    <Button variant="link" color="inherit" fontWeight="500" onClick={onCopy} ml={2} rightIcon={<Icon as={HiOutlineClipboardCopy} boxSize={5} />}>
                        Copy
                    </Button>
                </Box>
                <Spacer />
                <Box display="flex" width="10%" px={2}>0.5016 ETH</Box>
            </Box>
        </>
    );
};

export default Wallets;
