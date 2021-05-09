import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Alert, Box, Button, FormControl, FormLabel, Grid, GridItem, Heading, Icon, Input, SimpleGrid, useRadioGroup } from '@chakra-ui/react';
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
    const [template, selectedTemplate] = useState({ loaded: false, template: { bytes: "", idgraphsTemplates: 0, title: "", description: "" } })

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
                setStep(!step)
                setIsLoading(false)
            });
    }

    return (
        <>
            <h1>Template Wizard</h1>
            <Alert status="info">
                <i className="fal fa-info-circle"></i> GraphLinq’s Instant Deploy Wizard lets you choose a template, fill in variables and deploy it instantly without having to code or making any changes on the IDE.
            </Alert>
            <Grid templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(3, 1fr)"]} gap={6}>
                <GridItem colSpan={2} rounded="xl" w="100%" h="full" bg="#15122b" p="1.5rem" display="flex" flexDirection="column">
                    {step &&
                        <TemplatesList isLoading={isLoading} group={group} template={template} templates={templates} getRadioProps={getRadioProps} fileUpload={fileUpload} graphName={graphName} setGraphName={setGraphName} updateStep={updateStep} />
                    }
                    {!step &&
                        <Suspense fallback="loading">
                            <TemplateVars templateData={graphData} templateName={template.template.title} templateDesc={template.template.description} step={step} setStep={setStep} />
                        </Suspense>
                    }
                </GridItem>
                <GridItem colSpan={1} rounded="xl" w="100%" minH="275" maxH="450px" bg="#15122b" p="1.5rem" display="flex" flexDirection="column">
                    <Box mx="auto" textAlign="center">
                        <Icon as={HiOutlineInformationCircle} color="#2334ff" w={8} h={8} />
                        <Heading size="md" color="#ece7fd" my="0.75rem">How to use a template ?</Heading>
                    </Box>
                    <Box as="ul" textAlign="left" mx="auto" mt="1rel">
                        <li style={{ marginTop: '.5rem', marginBottom: '.5rem' }}>You can :</li>
                        <li>- Select a template from the list</li>
                        <li>- Fill in required variables</li>
                        <li style={{ marginTop: '.5rem', marginBottom: '.5rem' }}>Or for more advanced user :</li>
                        <li>- Select a template</li>
                        <li>- Download it</li>
                        <li>- Upload & Edit it in the <a href="https://ide.graphlinq.io/" target="_blank" style={{ color: "#2334ff" }}>IDE</a> to suits their needs</li>
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
                <Box ml="auto" mt="0.75rem">
                    <Button as="a"
                        bgColor="transparent" variant="outline" borderColor="#aba1ca" color="#aba1ca" _hover={{ bgColor: "#2334ff", borderColor: '#2334ff', color: "white" }} mr="1rem"
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(props.template.bytes)}`}
                        download={`${props.template.template.key}.glq`}
                    >
                        Download .GLQ
                    </Button>
                    <Button as="a"
                        bgColor="transparent" variant="outline" borderColor="#aba1ca" color="#aba1ca" _hover={{ bgColor: "#2334ff", borderColor: '#2334ff', color: "white" }} mr="1rem"
                        href={`https://ide.graphlinq.io/?loadGraph=${props.template.template.idgraphsTemplates}`}
                        target="_blank"
                    >
                        Edit on IDE
                    </Button>
                    <Button bgColor="#2334ff" color="white" _hover={{ bgColor: "#202cc3" }} onClick={() => props.updateStep()} isLoading={props.isLoading} loadingText="Loading">Next</Button>
                </Box>
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

const TemplateVars = (props: any) => {

    const [decompTemplate, setDecompTemplate] = useState<TemplateRoot>(props.templateData)
    const [compressedTemplate, setCompressedTemplate] = useState<any>()

    const [testTemplate, setTestTemplate] = useState('')

    const [fields, setFields] = useState(new Map())

    const handleChange = (i: any, v: any, node: TemplateNode) => {
        setFields(new Map(fields.set(i, v)));
        setDecompTemplate((decompTemplate) => {
            node.out_parameters[0].value = v
            return ({
                ...decompTemplate
            })
        })
    }

    useEffect(() => {
        decompTemplate?.nodes
            .filter(node => node.block_type === "variable" && node.friendly_name !== "do_not_show")
            .map((node, i: number) => (
                handleChange(i, node.out_parameters[0].value, node)
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

    async function deployTemplate() {
        setIsLoading(true)
        compressGraph(JSON.stringify(decompTemplate))
            .then(data => {
                deployGraphTemplate(data)
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
            <Heading size="md" color="#ece7fd" mb="1rem">{props.templateName} :</Heading>
            <p>{props.templateDesc}</p>
            <form>
                {decompTemplate?.nodes
                    .filter(node => node.block_type === "variable" && node.friendly_name !== "do_not_show")
                    .map((node, i: number) => (
                        <FormControl my="2.5rem" id={node.id} key={node.id} isRequired>
                            <FormLabel>{node.friendly_name} :</FormLabel>
                            <Input id={node.id} key={node.id} type="text" variant="flushed" focusBorderColor="#2334ff" placeholder={node.friendly_name} value={fields.get(i) || node.out_parameters[0].value || ''} onChange={(e) => handleChange(i, e.target.value, node)} />
                        </FormControl>
                    ))}
            </form>
            <Box ml="auto" mt="auto">
                <Button bgColor="transparent" variant="outline" borderColor="#aba1ca" color="#aba1ca" _hover={{ bgColor: "#2334ff", borderColor: '#2334ff', color: "white" }} mr="1rem" onClick={previous}>Previous</Button>
                <Button bgColor="#2334ff" color="white" _hover={{ bgColor: "#202cc3" }} onClick={deployTemplate} isLoading={isLoading} loadingText="Loading">Deploy</Button>
            </Box>
            {/* <FormControl id="graphName" my="2.5rem">
                <FormLabel>Test :</FormLabel>
                <Input type="text" variant="flushed" focusBorderColor="#2334ff" placeholder="placeholder" value={testTemplate} onChange={(e) => { setTestTemplate(e.target.value) }} />
            </FormControl>
            <Button bgColor="#2334ff" color="white" _hover={{ bgColor: "#202cc3" }} onClick={() => compressGraph(testTemplate).then(data => { console.log(data) })}>Compress</Button> */}
        </>
    );
}

export default Templates;