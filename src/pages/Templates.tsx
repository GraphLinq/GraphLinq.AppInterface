import { Box, Button, FormControl, FormHelperText, FormLabel, Grid, GridItem, Heading, Icon, Input, SimpleGrid, Text, useRadioGroup } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { GraphStateEnum } from '../enums/graphState';
import { RadioCard } from '../components/GraphCreation/RadioCard';
import { TemplateCard } from '../components/GraphCreation/TemplateCard';
import { GraphTemplate } from '../providers/responses/templateGraph';
import GraphService from '../services/graphService';

interface TemplatesProps {

}

const Templates: React.FC<TemplatesProps> = ({ }) => {

    const [fileUpload, setFileUpload] = useState({ loaded: false, file: {} })
    const [graphName, setGraphName] = useState("")
    const [template, selectedTemplate] = useState({ loaded: false, template: { bytes: "", idgraphsTemplates: 0 } })

    const inputFileRef = React.createRef()
    const [templates, setTemplates] = useState<GraphTemplate[]>([])

    useEffect(() => {
        const fetchTemplates = async () => {
            const templates: GraphTemplate[] = await GraphService.listGraphsTemplates()
            setTemplates(templates)
        }
        fetchTemplates()
    }, [])


    const { getRootProps, getRadioProps } = useRadioGroup({
        name: "template",
        onChange: (e) => {
            const template = templates.find(x => x.key === e)
            if (template !== undefined) {
                selectedTemplate({ loaded: true, template: template })
            }
        },
    })

    const group = getRootProps()

    const [step, setStep] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function readFileDataAsBase64(file: File) {

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event: any) => {
                resolve(event.target.result);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsBinaryString(file);
        });
    }

    async function deployFileGraph(file: File) {
        try {
            const data: any = await readFileDataAsBase64(file)
            const result: String | undefined = await GraphService.deployGraph({
                state: GraphStateEnum.Starting,
                bytes: data,
                alias: graphName,
                hash: undefined
            })

            if (result instanceof String) {
                setSuccess(`${result}`)
            } else {
                setError('Your graph file was incomplete or invalid, please check it on the IDE')
            }
        }
        catch (e) {
            console.error(e)
            setError('An error occured while trying to parse your file, please try again')
        }
    }

    function updateStep() {
        if (!step && fileUpload.loaded) {
            deployFileGraph(fileUpload.file as File)
            return
        }
        setStep(!step)
    }

    return (
        <>
            <h1>Templates</h1>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                <GridItem colSpan={2} rounded="xl" w="100%" h="full" bg="#15122b" p="1.5rem" display="flex" flexDirection="column">
                    {step &&
                        <TemplatesList group={group} template={template} templates={templates} getRadioProps={getRadioProps} fileUpload={fileUpload} graphName={graphName} setGraphName={setGraphName} updateStep={updateStep} />
                    }
                    {!step &&
                        /**@todo templates input */
                        <TemplateVars step={step} setStep={setStep} />
                    }
                </GridItem>
                <GridItem colSpan={1} rounded="xl" w="100%" h="275" bg="#15122b" p="1.5rem" display="flex" flexDirection="column">
                    <Box mx="auto" textAlign="center">
                        <Icon as={HiOutlineInformationCircle} color="#2334ff" w={8} h={8} />
                        <Heading size="md" color="#ece7fd" my="0.75rem">How to create a graph ?</Heading>
                    </Box>
                    <Box as="ul" textAlign="left" mx="auto" mt="1rel">
                        <li>- Choose a Name</li>
                        <li>- Select a template</li>
                        <li>- Add the required variables</li>
                    </Box>
                    <Box mt="auto" mx="auto" textAlign="center">
                        You can also start from scratch directly using our <a href="https://ide.graphlinq.io/" target="_blank" style={{ color: "#2334ff" }}>IDE</a>
                    </Box>
                </GridItem>
            </Grid>
        </>
    );
}

const TemplatesList = (props: any) => {

    return (
        <>
            <Heading size="md" color="#ece7fd">Select a graph template :</Heading>
            <FormControl id="graphName" my="2.5rem" isRequired>
                <FormLabel>Graph Name :</FormLabel>
                <Input type="text" variant="flushed" focusBorderColor="#2334ff" placeholder="New Graph" value={props.graphName} onChange={(e) => { props.setGraphName(e.target.value) }} />
            </FormControl>
            <Heading size="md" color="#ece7fd" mb="1.75rem">Templates :</Heading>
            <SimpleGrid className="ls-g" {...props.group} height="350px" overflowY="scroll">
                {props.templates.map((template: any) => {
                    const radio = props.getRadioProps({ value: template.key })
                    return (
                        <RadioCard clickable={false} fileLoaded={props.fileUpload.loaded} key={template.key} {...radio}>
                            <TemplateCard TemplateImageUrl={"none"} TemplateImageAlt={template.description} TemplateTitle={template.title} />
                        </RadioCard>
                    )
                })}
            </SimpleGrid>
            { props.template.loaded && props.graphName !== "" &&
                <Button bgColor="#2334ff" color="white" ml="auto" mt="0.75rem" _hover={{ bgColor: "#202cc3" }} onClick={() => props.updateStep()}>Next</Button>
            }
        </>
    );
}

const TemplateVars = (props: any) => {

    return (
        <>
            <Heading size="md" color="#ece7fd">Template Variables :</Heading>
            <FormControl id="graphName" my="2.5rem" isRequired>
                <FormLabel>Test :</FormLabel>
                <Input type="text" variant="flushed" focusBorderColor="#2334ff" placeholder="placeholder" value={props.graphName} onChange={(e) => { props.setGraphName(e.target.value) }} />
            </FormControl>
            <Box ml="auto" mt="0.75rem">
                <Button bgColor="transparent" variant="outline" borderColor="#aba1ca" color="#aba1ca" _hover={{ bgColor: "#aba1ca", color: "white" }} mr="1rem" onClick={() => props.setStep(true)}>Previous</Button>
                <Button bgColor="#2334ff" color="white" _hover={{ bgColor: "#202cc3" }}>Deploy</Button>
            </Box>
        </>
    );
}

export default Templates;