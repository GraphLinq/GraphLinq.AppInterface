import React, { useState, useEffect } from 'react';
import { Grid, Heading, VStack, Box, Flex, Text, Spacer, HStack, IconButton, Icon, Button, Alert, AlertIcon, Center } from '@chakra-ui/react';
import { GraphCard } from '../components/Graphs/GraphCard';
import { HiPlus } from 'react-icons/hi';
import { GraphResponse } from '../providers/responses/graph';
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";

import GraphService from '../services/graphService';
import { GRAPH_UPDATE } from '../redux/actions';
import { GraphStateEnum } from '../enums/graphState';
import { SuspenseSpinner } from '../components/SuspenseSpinner';
import { GraphCreation } from '../components/GraphCreation/GraphCreation';

interface GraphsProps {

}

const Graphs: React.FC<GraphsProps> = ({ }) => {

    const [reachable, setReacheable] = useState(true)
    const { account } = useWeb3React();
    const dispatch = useDispatch();

    const graphsList: GraphResponse[] = useSelector(
        (state: any) => state.modals.graphs.list
    );

    const loaded: boolean = useSelector(
        (state: any) => state.modals.graphs.loaded
    );

    useEffect(() => {
        const refreshfnc = async () => {
            const graphs: GraphResponse[] | undefined = await GraphService.listGraphs();
            if (graphs === undefined) {
                return setReacheable(false)
             }

            dispatch({
                name: "graphs",
                type: GRAPH_UPDATE,
                payload: { graphs, loaded: true },
            })

            setTimeout(refreshfnc, 10000)
        };

        refreshfnc()
    }, [account])

    return (
        <Grid px={24}>
            <Heading as="h1" size="lg" fontWeight="semibold" textColor="gray.700" my={12}>Graphs</Heading>
            <Box
                w="full" py={2} px={6}
                bgColor="brand.500"
                borderRadius="md"
                mb={6}
            >
                <Flex alignItems="center">
                    <Text fontSize="md" textColor="brand.50">
                        Below is the list of your Graphs. You can view logs, stop or delete each one of them.
                        </Text>
                    <Spacer />
                    <GraphCreation
                        colorScheme="brand"
                        rightIcon={<Icon w={5} h={5} as={HiPlus} />}
                    >
                        New Graph
                    </GraphCreation>
                </Flex>
            </Box>

            {reachable && !loaded &&
            <SuspenseSpinner/>}

            {!reachable &&
             <Alert status="error" variant="left-accent" whiteSpace="pre-wrap">
             <AlertIcon />
             The engine main-net network can't be reached, please try again later or contact the <i>GraphLinq Support</i>.
         </Alert>}

            {graphsList.length == 0 && loaded &&
                <Alert status="warning" variant="left-accent" whiteSpace="pre-wrap">
                    <AlertIcon />
                    You don't have created or deployed any graph yet, refer to our 
                    <Box
                        as="a"
                        target="_blank"
                        marginStart="1"
                        href="https://docs.graphlinq.io/graph"
                        color='amber.600'
                        _hover={{ color: 'amber.700' }}
                        display={{ base: 'block', sm: 'revert' }}
                    >documentation</Box> to start your journey.
                </Alert>
            }

            {graphsList.length > 0 &&
            <div>
                <Box py={3} px={8}>
                    <Flex alignItems="center">
                        <Box flex="1 1 0%" display="flex" px={2}>
                            <Text fontSize="xs" textColor="gray.500">Name :</Text>
                            <Spacer />
                        </Box>
                        <Box display="flex" width="48px" minH="48px" justifyContent="center" px={2} />
                        <Box display="flex" width="200px" px={2}>
                            <Text fontSize="xs" textColor="gray.500">Hosted API :</Text>
                            <Spacer />
                        </Box>
                        <Box display="flex" width="200px" px={2}>
                            <Text fontSize="xs" textColor="gray.500">Execution cost :</Text>
                            <Spacer />
                        </Box>
                        <Box display="flex" width="160px" px={2}>
                            <Text fontSize="xs" textColor="gray.500">Running since :</Text>
                            <Spacer />
                        </Box>
                        <Box display="flex" width="160px" px={2}>
                            <Text fontSize="xs" textColor="gray.500">Created :</Text>
                            <Spacer />
                        </Box>
                        <Box display="flex" width="135px" minH="48px" justifyContent="center" px={2} />
                        <Box display="flex" width="40px" minH="48px" justifyContent="center" />
                    </Flex>
                </Box>
                <VStack spacing={8} mb={4}>
                    {graphsList.sort((a: GraphResponse, b: GraphResponse) => { return b.state - a.state }).map((x: GraphResponse, i: number) => {
                        return <GraphCard key={`graph-${i}`} GraphInfo={x} />
                    })}
                </VStack>
            </div>
            }
        </Grid>
    );
}

export default Graphs;