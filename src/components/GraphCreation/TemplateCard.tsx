import React from 'react'
import { Box, Image, Badge, useRadio } from '@chakra-ui/react';
import TemplateLogo from "../../assets/template_logo.png"

interface TemplateCardProps {
    TemplateImageUrl: string,
    TemplateImageAlt: string,
    TemplateTitle: string,
}

export const TemplateCard: React.FC<TemplateCardProps> = (props) => {

    return (
        <>
            <Box
                h="90px"
                maxH="90px"
                bgImage={"url('" + TemplateLogo + "')"}
                bgPosition="center"
                bgRepeat="no-repeat"
            />

            <Box p="2">
                <Box d="flex" alignItems="baseline">
                    <Box
                        color="gray.600"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="capitalize"
                        ml="2"
                    >
                        {props.TemplateTitle}
                    </Box>
                </Box>
            </Box>
        </>
    );
}