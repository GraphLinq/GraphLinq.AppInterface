import React from 'react'
import { Heading, Text, Box, Button, SimpleGrid, Tabs, TabList, Tab, TabPanels, TabPanel, Spacer, Image, Center, Icon } from '@chakra-ui/react';
import GLQLogo from "../assets/logo.svg"
import WalletManager from "../components/BrowserWallet/WalletManager"

interface AuthProps {

}

const Auth: React.FC<AuthProps> = ({ }) => {
    return (
        <Box bg='gray.50' minH="100vh" py="12" px={{ sm: '6', lg: '8' }}>
            <Box maxW={{ sm: 'md' }} mx={{ sm: 'auto' }} w={{ sm: 'full' }}>
                <Box mb={{ base: '10', md: '10' }}>
                    <Center>
                        <Image w="200px" src={GLQLogo} />
                    </Center>
                </Box>
            </Box>
            <Box maxW={{ sm: 'md' }} mx={{ sm: 'auto' }} mt="8" w={{ sm: 'full' }}>
                <Box
                    bg='white'
                    py="8"
                    shadow="base"
                    rounded={{ sm: 'lg' }}
                >
                    <Heading textAlign="center" size="lg" fontWeight="bold">
                        Dashboard Access
                    </Heading>
                    <Text mt="4" align="center" maxW="md" fontWeight="medium">
                        Connect your wallet to access your dashboard.
                    </Text>
                    <Tabs mt="6" isLazy w="full" colorScheme="brand">
                        <TabList>
                            <Tab>Browser Extension</Tab>
                            <Tab isDisabled>Wallet Direct</Tab>
                            <Tab isDisabled>Ledger USB</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <SimpleGrid mt="6" columns={1} spacing="3" px="6">
                                    <WalletManager />
                                </SimpleGrid>
                            </TabPanel>
                            <TabPanel>
                                <p>Wallet Direct component</p>
                            </TabPanel>
                            <TabPanel>
                                <p>Ledger USB component</p>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
                <Text mt="4" align="center" maxW="md" fontWeight="medium">
                    <span>New to GraphLinq Wallet ?</span>
                    <Box
                        target="_blank"
                        as="a"
                        marginStart="1"
                        href="https://docs.graphlinq.io/wallet"
                        color='brand.500'
                        _hover={{ color: 'purple.600' }}
                        display={{ base: 'block', sm: 'revert' }}
                    >Learn more</Box>
                </Text>
            </Box>
        </Box>
    );
}

export default Auth;