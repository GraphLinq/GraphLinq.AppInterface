import { Alert, Box, Button, FormControl, FormLabel, Grid, GridItem, Heading, Icon, Input, SimpleGrid, useRadioGroup } from '@chakra-ui/react';
import React, { Suspense, useEffect, useRef, useState } from 'react'
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

    const [graphData, setGraphData] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const fetchGraphData = async (template: any) => {
        return await GraphService.decompressGraph(template)
    }

    async function updateStep() {
        setIsLoading(true)
        fetchGraphData(template.template.bytes)
            .then(data => {
                setGraphData(JSON.parse(data))
                console.log("ok")
                setStep(!step)
                setIsLoading(false)
            });
    }

    return (
        <>
            <h1>Templates</h1>
            <Grid templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(3, 1fr)"]} gap={6}>
                <GridItem colSpan={2} rounded="xl" w="100%" h="full" bg="#15122b" p="1.5rem" display="flex" flexDirection="column">
                    {step &&
                        <TemplatesList isLoading={isLoading} group={group} template={template} templates={templates} getRadioProps={getRadioProps} fileUpload={fileUpload} graphName={graphName} setGraphName={setGraphName} updateStep={updateStep} />
                    }
                    {!step &&
                        <Suspense fallback="loading">
                            <TemplateVars templateData={graphData} step={step} setStep={setStep} />
                        </Suspense>
                    }
                </GridItem>
                <GridItem colSpan={1} rounded="xl" w="100%" h="275" bg="#15122b" p="1.5rem" display="flex" flexDirection="column">
                    <Box mx="auto" textAlign="center">
                        <Icon as={HiOutlineInformationCircle} color="#2334ff" w={8} h={8} />
                        <Heading size="md" color="#ece7fd" my="0.75rem">How to use a template ?</Heading>
                    </Box>
                    <Box as="ul" textAlign="left" mx="auto" mt="1rel">
                        <li>- Select a template from the list</li>
                        <li>- Fill in variables</li>
                        <li>- Deploy in one click</li>
                    </Box>
                    <Box mt="auto" mx="auto" textAlign="center">
                        You can also make your own custom Graph from scratch using our <a href="https://ide.graphlinq.io/" target="_blank" style={{ color: "#2334ff" }}>IDE</a>
                    </Box>
                </GridItem>
            </Grid>
        </>
    );
}

const TemplatesList = (props: any) => {

    return (
        <>
            <Heading size="md" color="#ece7fd" mt="1rem" mb="2rem">Select a graph template :</Heading>
            {/* <FormControl id="graphName" my="2.5rem" isRequired>
                <FormLabel>Graph Name :</FormLabel>
                <Input type="text" variant="flushed" focusBorderColor="#2334ff" placeholder="New Graph" value={props.graphName} onChange={(e) => { props.setGraphName(e.target.value) }} />
            </FormControl> */}
            {/* <Heading size="md" color="#ece7fd" mb="1.75rem">Templates :</Heading> */}
            <SimpleGrid className="ls-g" {...props.group} height="500px" overflowY="scroll">
                {props.templates.map((template: any) => {
                    const radio = props.getRadioProps({ value: template.key })
                    return (
                        <RadioCard clickable={false} fileLoaded={props.fileUpload.loaded} key={template.key} {...radio}>
                            <TemplateCard TemplateImageUrl={"none"} TemplateImageAlt={template.description} TemplateTitle={template.title} />
                        </RadioCard>
                    )
                })}
            </SimpleGrid>
            { props.template.loaded /* && props.graphName !== "" */ &&
                <Button bgColor="#2334ff" color="white" ml="auto" mt="0.75rem" _hover={{ bgColor: "#202cc3" }} onClick={() => props.updateStep()} isLoading={props.isLoading} loadingText="Loading">Next</Button>
            }
        </>
    );
}

interface TemplateRoot {
    name: string
    nodes: TemplateNode[]
    comments: any[]
}

interface TemplateNode {
    id: string
    type: string
    out_node?: string
    can_be_executed: boolean
    can_execute: boolean
    friendly_name: string
    block_type: string
    _x: number
    _y: number
    in_parameters: TemplateInParameter[]
    out_parameters: TemplateOutParameter[]
}

interface TemplateInParameter {
    id: string
    name: string
    type: string
    value: any
    assignment: string
    assignment_node: string
    value_is_reference: boolean
}

interface TemplateOutParameter {
    id: string
    name: string
    type: string
    value?: string
    assignment: string
    assignment_node: string
    value_is_reference: boolean
}

const testDecomp = ``

const TemplateVars = (props: any) => {

    const [decompTemplate, setDecompTemplate] = useState<TemplateRoot>()
    const [compressedTemplate, setCompressedTemplate] = useState<any>()

    const [fields, setFields] = useState(new Map())

    const handleChange = (i: any, v: any) => {
        setFields(new Map(fields.set(i, v)));
    }

    useEffect(() => {
        console.log(props.templateData)
        setDecompTemplate(props.templateData)
        decompTemplate?.nodes
            .filter(node => node.block_type === "variable")
            .map((node: any, i: number) => (
                handleChange(i, node.out_parameters[0].value)
            ))
    }, [])

    const compressGraph = async (template: any) => {
        const compData = await GraphService.compressGraph(template)
        setCompressedTemplate(compData)
        return compData
    }

    const previous = () => {
        props.setStep(true)
        setFields(new Map())
    }

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    async function deployGraphTemplate(data: any) {
        try {
            const result: String | undefined = await GraphService.deployGraph({
                state: GraphStateEnum.Starting,
                bytes: data,
                alias: decompTemplate?.name || 'no name',
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
        executeScroll()
    }

    async function deployTemplate () {
        setIsLoading(true)
        compressGraph(JSON.stringify(decompTemplate))
            .then(data => {
                console.log('data: ' + data)
                deployGraphTemplate(data)
                console.log("deployed")
                setIsLoading(false)
            })
    }

    const resultRef = useRef<HTMLInputElement>(null)

    const executeScroll = () => resultRef.current?.scrollIntoView()

    return (
        <>
            {success &&
                <Alert status="success" ref={resultRef}>
                    <i className="fal fa-check-circle"></i>
                    <p>Graph Successfully started, Congratulations!</p>
                    <p><small> {decompTemplate?.name || 'Template'} execution unique hash : {success}</small></p>
                </Alert>
            }
            {error &&
                <Alert style={{ marginBottom: "15px", marginTop: "15px" }} status="error" ref={resultRef}>
                    <i className="fal fa-times-circle"></i>
                    <p>{error}</p>
                </Alert>
            }
            <Heading size="md" color="#ece7fd">{decompTemplate?.name} :</Heading>
            {/* <FormControl id="graphName" my="2.5rem" isRequired>
                <FormLabel>Test :</FormLabel>
                <Input type="text" variant="flushed" focusBorderColor="#2334ff" placeholder="placeholder" value={decompTemplate} onChange={(e) => { setDecompTemplate(e.target.value) }} />
            </FormControl> */}
            <form>
                {decompTemplate?.nodes
                    .filter(node => node.block_type === "variable")
                    .map((node: any, i: number) => (
                        <FormControl my="2.5rem" id={node.id} key={node.id} isRequired>
                            <FormLabel>{node.friendly_name} :</FormLabel>
                            <Input id={node.id} key={node.id} type="text" variant="flushed" focusBorderColor="#2334ff" placeholder={node.friendly_name} value={fields.get(i) || node.out_parameters[0].value} onChange={(e) => handleChange(i, e.target.value)} />
                        </FormControl>
                    ))}
            </form>
            <Box ml="auto" mt="0.75rem">
                <Button bgColor="transparent" variant="outline" borderColor="#aba1ca" color="#aba1ca" _hover={{ bgColor: "#aba1ca", color: "white" }} mr="1rem" onClick={previous}>Previous</Button>
                <Button bgColor="#2334ff" color="white" _hover={{ bgColor: "#202cc3" }} onClick={deployTemplate} isLoading={isLoading} loadingText="Loading">Deploy</Button>
                {/* <Button bgColor="#2334ff" color="white" _hover={{ bgColor: "#202cc3" }} ml="1rem" onClick={() => compressGraph(decompTemplate).then(data => { compressGraph(JSON.stringify(data)) })}>Compress</Button> */}
            </Box>
        </>
    );
}

export default Templates;