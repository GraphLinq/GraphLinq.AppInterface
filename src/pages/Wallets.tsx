import React from "react";
import { Box, Spacer } from "@chakra-ui/react";

interface WalletsProps {}

const Wallets: React.FC<WalletsProps> = ({}) => {
    return (
        <>
            <h1>
                My Wallets
                <button className="bt">
                    Create Wallet <i className="fal fa-plus"></i>
                </button>
            </h1>
            <Box display="flex" alignItems="center" bg="linear-gradient(to bottom, #1d1938, #15122b)" w="full" px="8" py="6" rounded="lg">
                <Box>
                    WALLET_NAME
                </Box>
                <Box ml="12">
                    0xeB4A6F3d8154A18aD312692eCFE4eeF8Fde66439
                </Box>
                <Spacer />
                <Box>
                    0.5016 ETH
                </Box>
            </Box>
        </>
    );
};

export default Wallets;
