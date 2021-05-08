import { Alert } from '@chakra-ui/react';

const Page404 = () => {
        return (
            <>
                <h1>Error 404</h1>
                <Alert status="info">
                    <i className="fal fa-times-circle"></i> Sorry, page not found.
                </Alert>
                <br />
                <a className="bt" href="/app/home">Back to home <i className="fal fa-home"></i></a>
            </>
        );
}

export default Page404;