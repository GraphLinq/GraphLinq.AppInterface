import React from 'react'
import { Flex, Spacer, Box, Avatar, Tag, TagLabel, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Portal, Link, Button, keyframes } from '@chakra-ui/react';

import { WalletConnectIcon, CoinbaseWalletIcon, FortmaticIcon, PortisIcon } from "../../assets/icons";
import Identicon from "./identicon";

import {
    fortmatic,
    injected,
    portis,
    walletconnect,
    walletlink,
} from "../../connectors";

import { shortenAddress } from "../../utils/index";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { HiOutlineDatabase, HiOutlineDotsHorizontal } from 'react-icons/hi';
import { FiGithub, FiMessageCircle, FiMessageSquare, FiBookOpen, FiExternalLink } from "react-icons/fi";
import { GraphStateEnum } from '../../enums/graphState';
import { NavLink } from 'react-router-dom';


interface HeaderProps {

}

const pulse = keyframes({
    "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(139, 92, 246, 0.7)" },
    "70%": { transform: "scale(1)", boxShadow: "0 0 0 10px rgba(139, 92, 246, 0)" },
    "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(139, 92, 246, 0)" }
})

export const Header: React.FC<HeaderProps> = ({ }) => {
    const { account, connector } = useWeb3React();
    let amountBalance = useSelector((state: any) => state.modals.balance.amount);
    return (
        <Flex as="header" bgColor="white" py={4} px={6} boxShadow="0 5px 6px -7px rgb(0 0 0 / 60%), 0 2px 4px -5px rgb(0 0 0 / 6%)">
            <Spacer />
            {account !== undefined && (
                <Box mr={2}>
                    <Button
                    as={NavLink}
                    exact
                    to="private-sale"
                    leftIcon={<HiOutlineDatabase />}
                    size="sm"
                    colorScheme="brand"
                    bgGradient="linear(to-r, indigo.500,brand.500)"
                    variant="solid"
                    px={4}
                    mr={2}
                    rounded="full"
                    animation={`${pulse} 2s cubic-bezier(.4,0,.6,1) infinite`}
                    >
                        Private Sale
                    </Button>
                    <Tag size="lg" colorScheme="brand" borderRadius="full" mr={2}>
                        <TagLabel>{amountBalance} GLQ</TagLabel>
                    </Tag>
                    <Tag size="lg" colorScheme="brand" borderRadius="full">
                        {connector && <StatusIcon connector={connector} />}
                        <TagLabel>{shortenAddress(account)}</TagLabel>
                    </Tag>
                </Box>
            )}
            <Menu>
                <MenuButton
                    as={IconButton}
                    colorScheme="gray"
                    aria-label="Links"
                    icon={<Icon as={HiOutlineDotsHorizontal} w={5} h={5} />}
                    textColor="gray.700"
                    size="sm"
                />
                <MenuList>
                    <MenuItem as={Link} icon={<FiBookOpen />} href="https://docs.graphlinq.io/" isExternal>
                        Documentation
                    </MenuItem>
                    <MenuItem as={Link} icon={<FiMessageCircle />} href="https://discord.gg/k3tqWzub" isExternal>
                        Discord
                    </MenuItem>
                    <MenuItem as={Link} icon={<FiMessageSquare />} href="https://t.me/graphlinq" isExternal>
                        Telegram
                    </MenuItem>
                    <MenuItem as={Link} icon={<FiGithub />} href="https://github.com/GraphLinq/GraphLinq" isExternal>
                        Github
                    </MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: any) {
    if (connector === injected) {
        return <Identicon />;
    }
    if (connector === walletconnect) {
        return (
            <Avatar
                bgColor="white"
                as={WalletConnectIcon}
                size="xs"
                ml={-2}
                mr={2}
            />
        );
    }
    if (connector === walletlink) {
        return (
            <Avatar
                bgColor="white"
                as={CoinbaseWalletIcon}
                size="xs"
                ml={-2}
                mr={2}
            />

        );
    }
    if (connector === fortmatic) {
        return (
            <Avatar
                bgColor="white"
                as={FortmaticIcon}
                size="xs"
                ml={-2}
                mr={2}
            />
        );
    }
    if (connector === portis) {
        return (
            <Avatar
                bgColor="white"
                as={PortisIcon}
                size="xs"
                ml={-2}
                mr={2}
            />
        );
    }
    return null;
}