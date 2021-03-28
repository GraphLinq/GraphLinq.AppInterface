import { Box, Button, ButtonGroup, Icon, Text } from '@chakra-ui/react';
import { FiArrowDownLeft } from 'react-icons/fi';
import { ModalDeposit } from './ModalDeposit';
import { ModalWithdraw } from './ModalWithdraw';
import React, { useEffect, useState } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useWalletContract } from "../../hooks/useWalletContract"

interface ContractCardProps {

}

export const ContractCard: React.FC<ContractCardProps> = ({ }) => {

    const { account } = useWeb3React();
    const {balance, refreshBalanceContract} =  useWalletContract();

    useEffect(()  => {
        refreshBalanceContract();
    }, [account])

    return (
        <Box mx={2} my={2} borderWidth="0px" borderRadius="lg" bgColor="brand.400" color="white">
            <Box py="2" px="4">
                <Box
                    mt="1"
                    fontSize="md"
                    fontWeight="medium"
                    as="h4"
                    lineHeight="tight"
                    color="gray.50"
                >
                    Cloud Contract Balance
                </Box>
                <Text fontSize="2xl" fontWeight="bold" lineHeight="10" whiteSpace="pre-wrap">
                    {balance.amount}
                    <Box as="span" color="gray.100" fontWeight="semibold" fontSize="sm">
                        {" GLQ"}
                    </Box>
                </Text>
                <ButtonGroup size="sm" colorScheme="whiteAlpha">
                    <ModalDeposit />
                    <ModalWithdraw />
                </ButtonGroup>
            </Box>
        </Box>
    );
}