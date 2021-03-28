import { Grid, Heading } from '@chakra-ui/react';
import React from 'react'

interface Page404Props {

}

const Page404: React.FC<Page404Props> = ({}) => {
        return (
            <Grid px={24}>
                <Heading as="h1" size="lg" fontWeight="semibold" textColor="gray.700" my={12}>
                    Error 404
                </Heading>
            </Grid>
        );
}

export default Page404;