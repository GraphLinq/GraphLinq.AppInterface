import React from 'react'
import { Box, Image, Badge, useRadio } from '@chakra-ui/react';
import TemplateLogo from "../../assets/radio/r-02.svg"
import TemplateLogoSelect from "../../assets/radio/r-03.svg"

interface TemplateCardProps {
    TemplateImageUrl: string,
    TemplateImageAlt: string,
    TemplateTitle: string,
}

export const TemplateCard: React.FC<TemplateCardProps> = (props) => {

    return (
        <>
            <div className="lgc">
                <Box
                    className="lg-nsl"
                    h="50px"
                    maxH="50px"
                    bgImage={"url('" + TemplateLogo + "')"}
                    bgPosition="center"
                    bgRepeat="no-repeat"
                />
                <Box
                    className="lg-sl"
                    h="50px"
                    maxH="50px"
                    bgImage={"url('" + TemplateLogoSelect + "')"}
                    bgPosition="center"
                    bgRepeat="no-repeat"
                />
                {props.TemplateTitle}
            </div>
        </>
    );
}