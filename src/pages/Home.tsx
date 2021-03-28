import React from 'react'
import { Alert, AlertIcon, Grid, Heading } from '@chakra-ui/react';

interface HomeProps {

}

const Home: React.FC<HomeProps> = ({}) => {
        return (
            <Grid px={24}>
                <Heading as="h1" size="lg" fontWeight="semibold" textColor="gray.700" my={12}>
                    Home page
                </Heading>

                <Alert status="info">
                    <AlertIcon /> Welcome on the Beta release of the GraphLinq Protocol interface!
                </Alert>
            </Grid>
        );
}

export default Home;