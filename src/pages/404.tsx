import { Alert, Grid, Heading, Link } from '@chakra-ui/react';
import React from 'react'

interface Page404Props {

}

const Page404: React.FC<Page404Props> = ({}) => {
        return (
            <>
                <h1>Error 404</h1>
                <Alert status="info">
                    <i className="fal fa-times-circle"></i> Sorry, page not found.
                </Alert>
                <br />
                <a className="bt">Back to home <i className="fal fa-home"></i></a>
            </>
        );
}

export default Page404;