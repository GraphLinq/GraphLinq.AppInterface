import { Tooltip, Box } from '@chakra-ui/react';
import React from 'react'
import { GraphStateEnum } from '../../enums/graphState';

interface GraphStatusProps {
    state: number,
}

export const GraphStatus: React.FC<GraphStatusProps> = ({ state }) => {
    return (
            <StatusIcon status={state} />
    );
}

function StatusIcon({ status }: any) {
    if (status === GraphStateEnum.Stopped) { /* stopped */
        return (
            <Tooltip hasArrow arrowSize={10} label="Stopped" bg="gray.900" color="white" size="xs" placement="top">
                <Box as="span" w="10px" h="10px" borderRadius="50%" bgColor="gray.400" mr={3} />
            </Tooltip >
        );
    }
    if (status === GraphStateEnum.Starting || status === GraphStateEnum.Started) { /* running */
        return (
            <Tooltip hasArrow arrowSize={10} label="Running" bg="gray.900" color="white" size="xs" placement="top">
                <Box as="span" w="10px" h="10px" borderRadius="50%" bgColor="emerald.400" mr={3} />
            </Tooltip >
        );
    }
    if (status === GraphStateEnum.InError) { /* error */
        return (
            <Tooltip hasArrow arrowSize={10} label="In Error State" bg="gray.900" color="white" size="xs" placement="top">
                <Box as="span" w="10px" h="10px" borderRadius="50%" bgColor="red.400" mr={3} />
            </Tooltip >
        );
    }
    if (status === GraphStateEnum.Restarting) { /* restarting */
        return (
            <Tooltip hasArrow arrowSize={10} label="Restarting" bg="gray.900" color="white" size="xs" placement="top">
                <Box as="span" w="10px" h="10px" borderRadius="50%" bgColor="emerald.100" mr={3} />
            </Tooltip >
        );
    }
    if (status === GraphStateEnum.InPause) { /* paused */
        return (
            <Tooltip hasArrow arrowSize={10} label="Paused" bg="gray.900" color="white" size="xs" placement="top">
                <Box as="span" w="10px" h="10px" borderRadius="50%" bgColor="amber.400" mr={3} />
            </Tooltip >
        );
    }
    return null;
}