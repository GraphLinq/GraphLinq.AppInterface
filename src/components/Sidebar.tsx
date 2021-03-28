import React from 'react'
import { Box, VStack, Icon, Link, Button, Text, Image, Divider, Flex } from '@chakra-ui/react';
import { NavLink, Route } from 'react-router-dom';
import routes from '../routes/sidebar'
import * as Icons from 'react-icons/hi'
import GLQLogo from "../assets/logo.svg"
import { ContractCard } from './ContractBalance/ContractCard';
import { GraphCreation } from './GraphCreation/GraphCreation';

interface SidebarProps {

}

const IconSidebar = ({ icon, ...props }: any) => {
    const iconName = (Icons as any)[icon]
    return <Icon as={iconName} {...props} />
}

export const Sidebar: React.FC<SidebarProps> = ({ }) => {
    return (
        <Box as="aside" w={64} maxW={64} display="block" bgColor="white" flexShrink={0} overflowY="auto" py={4}>
            <Box py={2} px={8}>
                <Image src={GLQLogo} />
            </Box>
            <Divider orientation="horizontal" />
            <Flex direction="column" mt={8}>
                <GraphCreation colorScheme="brand" size="lg" mx={2}>
                    Make a Graph
                </GraphCreation>
                <ContractCard />
            </Flex>
            <VStack as="nav" spacing={0} align="stretch" mt={2} textColor="gray.500">
                {routes.map((route: any) => (
                    <Link
                        as={NavLink}
                        exact
                        to={route.path}
                        px={6} py={4}
                        position="relative"
                        bgColor="white"
                        textDecoration="none"
                        display="inline-flex"
                        alignItems="center"
                        w="full"
                        fontWeight="semibold"
                        fontSize="sm"
                        _activeLink={{ backgroundColor: 'indigo.50', textColor: 'brand.800' }}
                        _hover={{ textColor: 'brand.800' }}
                    >
                        <Route path={route.path} exact={route.exact}>
                            <Box as="span" pos="absolute" bgColor="brand.500" w={1} top="0" bottom="0" left="0" borderTopRightRadius="lg" borderBottomRightRadius="lg" />
                        </Route>
                        <IconSidebar icon={route.icon} w={5} h={5} />
                        <Text as="span" ml={4}>{route.name}</Text>
                    </Link>
                ))}
            </VStack>
        </Box >
    );
}