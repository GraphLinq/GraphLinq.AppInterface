import { AbsoluteCenter, Center, Flex, Spinner } from '@chakra-ui/react';
import React from 'react'

interface SuspenseSpinnerProps {

}

export const SuspenseSpinner: React.FC<SuspenseSpinnerProps> = ({ }) => {
    return (
        <Center h="full">
            <Spinner
                thickness="5px"
                speed="0.65s"
                emptyColor="gray.200"
                color="brand.500"
                size="xl"
            />
        </Center>
    );
}