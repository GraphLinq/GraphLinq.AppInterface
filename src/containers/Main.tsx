import React from 'react'
import { Box } from '@chakra-ui/react';

interface MainProps {
children: any;
}

export const Main: React.FC<MainProps> = ({ children }) => {

    return (
        <Box as="main" h="full" overflowY="auto">
            { children }
        </Box>
    );
}