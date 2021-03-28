import React from 'react'
import { Button, Text, Box, Icon, Spacer, Link } from '@chakra-ui/react';
import * as WalletIcons from "../../assets/icons";

export default function Option({
    link = "",
    clickable = true,
    size = 0,
    onClick = () => { },
    color = "",
    header = "",
    subheader = "",
    icon = "",
    active = false,
    id = ""
}) {
    const content = (
        <Button
            id={id}
            color="currentcolor"
            variant="outline"
            verticalAlign="center"
            isActive={active}
            width="full"
            _active={{ backgroundColor: "indigo.50" }}
            onClick={onClick}
        >
            {active ? (
                <Box as="span" w="10px" h="10px" borderRadius="50%" bgColor="green.300" mr={3} />
            ) : ('')}
            <Text>{header}</Text>
            <Spacer />
            <Icon as={(WalletIcons as any)[icon]} w={6} h={6} />
        </Button>
    )
    if (link) {
        return (
            <Link href={link} isExternal>
                {content}
            </Link>
        )
    }

    return content
}
