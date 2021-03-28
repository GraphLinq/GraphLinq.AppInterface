import React, {useEffect} from 'react'
import { Box, useRadio, Icon, Flex } from '@chakra-ui/react';
import { FiFile } from 'react-icons/fi';

interface BlankCardProps {

}

export const BlankCard: React.FC<BlankCardProps> = (props) => {



    return (
        <>
            <Flex justifyContent="center" alignItems="center" h="90px" maxH="90px" w="full" color="gray.600">
                <Icon as={FiFile} w="10" h="10" strokeWidth="1" />
            </Flex>

            <Box p="2">
                <Box d="flex" alignItems="baseline">
                    <Box
                        color="gray.600"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="capitalize"
                        ml="2"
                    >
                        Blank
                        </Box>
                </Box>
            </Box>
        </>
    );
}