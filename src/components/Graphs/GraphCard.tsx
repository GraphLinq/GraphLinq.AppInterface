import React, { useEffect, useRef } from 'react'
import { Flex, Text, Link, Spacer, Button, Icon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Menu, MenuButton, IconButton, MenuList, MenuItem, useDisclosure, Portal, Box, LinkOverlay, LinkBox, MenuDivider, Skeleton } from '@chakra-ui/react';
import { HiOutlineEye, HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MotionBox } from '../MotionBox'
import { GraphStatus } from './GraphStatus';
import { GraphResponse } from '../../providers/responses/graph';
import { GraphStateEnum } from '../../enums/graphState';
import GraphService from '../../services/graphService';
import { Log } from '../../providers/responses/logs';
import useInterval from '../../hooks/useInterval'
import Cookies from 'js-cookie'

interface GraphCardProps {
    GraphInfo: GraphResponse,
    GraphName?: string,
    GraphIDELink?: string,
    GraphExecCost?: number,
    GraphExecTime?: string,
    GraphCreation?: string,
    Status?: number
}

function timeSinceExecution(date: any): string {
    var now: Date = new Date();

    var timeStart = date.getTime();
    var timeEnd = now.getTime();
    var hourDiff = timeEnd - timeStart; //in ms
    var secDiff = hourDiff / 1000; //in s
    var minDiff = hourDiff / 60 / 1000; //in minutes
    var hDiff = hourDiff / 3600 / 1000; //in hours

    const hours = Math.floor(hDiff);
    const minutes = (minDiff - 60 * hours).toFixed(2)

    return `${hours} hours, ${minutes} minutes.`
}

export const GraphCard: React.FC<GraphCardProps> = ({
    GraphInfo = undefined,
    GraphName = "Default",
    GraphIDELink = "https://ide.graphlinq.io/graphId",
    GraphExecCost = null,
    GraphExecTime = "—",
    GraphCreation = "—",
    Status = 0,
    ...props
}) => {

    const [logs, setLogs] = React.useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [inLogs, setInLogs] = React.useState<boolean>(false);

    const bottomRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        scrollToBottom()
    }, [])

    const scrollToBottom = () => {
        if (bottomRef && bottomRef.current) {
            bottomRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    async function tickLogs() {
        setLogs((await GraphService.graphLogs(GraphInfo?.hashGraph ?? "")) as any)
        scrollToBottom()
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | null;

        if (inLogs) {
            tickLogs()
            interval = setInterval(async () => {
                if (interval) {
                    tickLogs()
                }
            }, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [inLogs]);

    function onLogsOpen() {
        onOpen()
        setInLogs(true)
    }

    function onLogsClose() {
        onClose()
        setInLogs(false)
    }

    function getColorLog(type: string): string {
        switch (type) {
            case "info":
                return "blue.400"
            case "success":
                return "emerald.500"
            case "warn":
                return "amber.500"
        }
        return ""
    }

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    async function changeGraphState(state: GraphStateEnum) {
        setIsLoading(true)
        const result: boolean = await GraphService.setGraphState(state, GraphInfo?.hashGraph ?? "")
        if (result && GraphInfo !== undefined) {
            GraphInfo.state = state
        }
        setIsLoading(false)
    }

    async function removeGraph() {
        setIsLoading(true)
        const result: boolean = await GraphService.removeGraph(GraphInfo?.hashGraph ?? "")
        setIsLoading(false)
    }

    async function deployGraph() {
        setIsLoading(true)
        const hash: String | undefined = await GraphService.deployGraph({
            state: GraphStateEnum.Starting,
            bytes: GraphInfo?.lastLoadedBytes ?? "",
            alias: GraphInfo?.alias ?? "Unnamed",
            hash: GraphInfo?.hashGraph
        })
        if (hash !== undefined && GraphInfo !== undefined) {
            GraphInfo.state = GraphStateEnum.Starting
        }
        setIsLoading(false)
    }

    async function exportGlqFile()
    {
        const element = document.createElement("a");
        const file = new Blob([(GraphInfo?.lastLoadedBytes as any)], 
                    {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = `${GraphInfo?.alias}.glq`;
        document.body.appendChild(element);
        element.click();
    }

    return (
        <MotionBox
            as="article"
            w="full"
            bgColor="gray.50"
            border="1px"
            borderColor="gray.300"
            borderRadius="md"
            py={4} px={8}
            transition={{
                type: 'spring',
                duration: 2,
                bounce: 0.5,
            }}
            whileHover={{ scale: 1.03, backgroundColor: "white", boxShadow: 'rgb(238 238 255 / 50%) 0px 2px 14px 8px' }}
            _hover={{ borderColor: "brand.800" }}
        >
            <Flex alignItems="center">
                <Box flex="1 1 0%" display="flex" alignItems="center" px={2}>
                    <GraphStatus state={GraphInfo?.state ?? 0} />
                    <Flex flexDirection="column">
                        <Link fontWeight="semibold" textColor="brand.800" href={GraphIDELink} isExternal>
                            {GraphInfo?.alias}
                        </Link>
                        <Text as="samp" fontSize="xs" textColor="gray.400" maxWidth="200px" isTruncated>{GraphInfo?.hashGraph}</Text>
                    </Flex>
                    <Spacer />
                </Box>

                <Box display="flex" width="48px" minH="48px" justifyContent="center" px={2} />
                {GraphInfo?.hostedApi &&
                <Box display="flex" width="200px" px={2}>
                    <Skeleton isLoaded={!isLoading}>
                    
                        <Link fontSize="xs" fontWeight="semibold" textColor="brand.800" href={`https://api-hosted.graphlinq.io/${GraphInfo?.hashGraph}`} isExternal>
                        api-hosted.graphlinq.io/{GraphInfo?.hashGraph.substr(0, 6)}..
                        </Link>
                          
                        <Spacer />
                    </Skeleton>
                </Box>
                }
                <Box display="flex" width="200px" px={2}>
                    <Skeleton isLoaded={!isLoading}>
                        <Text fontSize="sm" textColor="gray.600">{GraphInfo?.lastExecutionCost || "—"} GLQ</Text>
                        <Spacer />
                    </Skeleton>
                </Box>
                <Box display="flex" width="160px" px={2}>
                    <Skeleton isLoaded={!isLoading}>
                        <Text fontSize="sm" textColor="gray.600">{(GraphInfo?.state === GraphStateEnum.Started) ? timeSinceExecution(GraphInfo?.loadedAt) : "—"}</Text>
                        <Spacer />
                    </Skeleton>
                </Box>
                <Box display="flex" width="160px" px={2}>
                    <Skeleton isLoaded={!isLoading}>
                        <Text fontSize="sm" textColor="gray.600">{GraphInfo?.createdAt.toLocaleString()}</Text>
                    </Skeleton>
                    <Spacer />
                </Box>
                <Button
                    leftIcon={<Icon as={HiOutlineEye} w={5} h={5} />}
                    onClick={onLogsOpen}
                    mr={3}
                    textColor="gray.700"
                    size="md"
                    variant="outline"
                    px={2}
                >
                    View Logs
                </Button>

                <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="full">
                    <ModalOverlay />
                    <ModalContent mx={8}>
                        <ModalHeader bgColor="gray.800" textColor="white" borderTopRadius="md">Logs</ModalHeader>
                        <ModalCloseButton color="white" />
                        <ModalBody bgColor="gray.900" textColor="gray.200">
                            {logs === undefined && <Text textColor="amber.500">No logs available...</Text>}
                            {logs !== undefined && logs.map((x: Log, i: number) => {
                                return <Text textColor={getColorLog(x.type)} key={`txt-${i}`}>[{x.type}] ({new Date(x.timestamp).toLocaleString()}):<br /> {x.message}</Text>
                            })}
                            <div ref={bottomRef}></div>
                        </ModalBody>
                        <ModalFooter bgColor="gray.800" textColor="white" borderBottomRadius="md">
                            <Button colorScheme="blackAlpha" onClick={onLogsClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<Icon as={HiOutlineDotsHorizontal} w={5} h={5} />}
                        textColor="gray.700"
                        size="md"
                        variant="outline"
                        isLoading={isLoading}
                        disabled={isLoading}
                    />
                    <Portal>
                        <MenuList>
                            <MenuItem textColor="emerald.500" onClick={() => { deployGraph() }}>Start</MenuItem>
                            <MenuItem onClick={() => { changeGraphState(GraphStateEnum.Restarting) }}>Force restart</MenuItem>
                            <MenuItem onClick={() => { changeGraphState(GraphStateEnum.Stopped) }}>Stop</MenuItem>
                            <MenuItem onClick={() => { removeGraph() }} textColor="red.500">Delete</MenuItem>
                            <MenuDivider />
                            {/* <MenuItem onClick={() => {
                                var host = window.location.hostname.replace('app.', '')
                                Cookies.set('graph', GraphInfo?.lastLoadedBytes ?? "", { domain: host });
                                window.open(`https://ide.graphlinq.io/?loadGraph`, "_blank")
                            }}>Edit</MenuItem> */}
                            <MenuItem onClick={() => { exportGlqFile() }}textColor="amber.500">Export as .GLQ File</MenuItem>
                        </MenuList>
                    </Portal>
                </Menu>
            </Flex>
        </MotionBox>
    );
}

export default GraphCard;