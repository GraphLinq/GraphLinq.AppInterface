import React, { useState, useEffect } from 'react'
import { Box, Button, Editable, EditableInput, Alert, AlertTitle, Text, AlertDescription, AlertIcon, EditablePreview, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, propNames, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure, useRadioGroup, Icon, Flex } from '@chakra-ui/react';
import { TemplateCard } from './TemplateCard';
import { BlankCard } from './BlankCard';
import { TemplateVariables } from './TemplateVariables';
import { RadioCard } from './RadioCard';
import { TemplateFile } from './TemplateFile';
import GraphService from '../../services/graphService';
import { GraphStateEnum } from '../../enums/graphState';
import { FiEdit } from 'react-icons/fi';
import Cookies from 'js-cookie'
import { GraphTemplate } from '../../providers/responses/templateGraph';

interface GraphCreationProps {

}

export const GraphCreation = (props: any) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [fileUpload, setFileUpload] = useState({ loaded: false, file: {} })
    const [graphName, setGraphName] = useState("Unnamed Graph")
    const [template, selectedTemplate] = useState({ loaded: false, template: {bytes: "", idgraphsTemplates: 0} })

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
        defaultValue: "blank",
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

    async function onFileChange(e: any) {
        console.log(e.target.files[0])
        setFileUpload({ loaded: true, file: e.target.files[0] })
        setGraphName(e.target.files[0].name.toUpperCase().split('.GLQ')[0])
    }

    function resetEntry() {
        selectedTemplate({ loaded: false, template: {bytes: "", idgraphsTemplates: 0} })
        setFileUpload({ loaded: false, file: {} })
        setStep(true)
    }

    function onInputClick(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        const element = event.target as HTMLInputElement
        element.value = ''
    }

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
            <button onClick={onOpen} {...props}>{props.children}</button>
            <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
                <ModalOverlay className="ov" />
                <ModalContent className="mod mod-cre">
                    <header>
                        {step ?
                            <Flex className="fd in fal fa-pencil">
                                <Editable defaultValue={graphName} w="lg">
                                    <EditablePreview />
                                    <EditableInput value={graphName} onChange={(e) => { setGraphName(e.target.value) }} />
                                </Editable>
                            </Flex>
                            :
                            <Box>
                                Settings Deployment
                            </Box>
                        }
                    </header>
                    <ModalCloseButton className="clo" />
                    <ModalBody>
                        {success &&
                            <Alert status="success">
                                <i className="fal fa-check-circle"></i> 
                                <p>Graph Successfully started, Congratulations!</p>
                                <p><small> {graphName} execution unique hash : {success}</small></p>
                            </Alert>
                        }
                        {error &&
                            <Alert style={{ marginBottom: "15px", marginTop: "15px" }} status="error">
                                <i className="fal fa-times-circle"></i> 
                                <p>{error}</p>
                            </Alert>
                        }
                        {step &&
                            <SimpleGrid className="ls-g" {...group}>
                                <RadioCard className="lg" clickable={true} key="blank" {...getRadioProps({ value: "blank" })}>
                                    <div onClick={() => { window.open("https://ide.graphlinq.io", "_blank") }}><BlankCard /></div>
                                </RadioCard>
                                {templates.map((template) => {
                                    const radio = getRadioProps({ value: template.key })
                                    return (
                                        <RadioCard clickable={false} fileLoaded={fileUpload.loaded} key={template.key} {...radio}>
                                            <TemplateCard TemplateImageUrl={"none"} TemplateImageAlt={template.description} TemplateTitle={template.title} />
                                        </RadioCard>
                                    )
                                })}
                            </SimpleGrid>}
                        {/* {!step && !fileUpload.loaded &&
                            <TemplateVariables />} */}

                        {!step && fileUpload.loaded &&
                            <TemplateFile name={graphName} file={fileUpload.file as any} />}
                        <Alert status="info">
                            <i className="fal fa-info-circle"></i> 
                            <p>Template system are still in development, you can import a GLQ file generated directly from our <a style={{ color: '#3907ff' }} target="_blank" href="https://ide.graphlinq.io">IDE</a> (File -&gt; Save Graph). </p>
                        </Alert>

                    </ModalBody>
                    <ModalFooter className="fot">
                        {fileUpload.loaded &&
                            <Box className="inf">
                                <p>Graph file uploaded successfully: size of <b>{(fileUpload.file as any).size} bytes</b> (name: {(fileUpload.file as any).name})</p>
                            </Box>
                        }
                        {!fileUpload.loaded && template.loaded &&
                            <Box className="inf">
                                <p><b>{(template.template as any).title}</b> selected, go to IDE to setup variables and deploy the graph here by importing the file.</p>
                            </Box>
                        }
                        <input ref={inputFileRef as any} id="files" hidden={true} type="file" onClick={onInputClick} onChange={onFileChange} />
                        {!fileUpload.loaded && <Button onClick={() => { (inputFileRef as any).current.click() }} htmlFor="files" className="sbt" hidden={!step}>Import .GLQ</Button>}
                        {!step || fileUpload.loaded &&
                            <Button onClick={() => { resetEntry() }} className="sbt">Reset</Button>}
                        {!step &&
                            <Button className="sbt" mr={3} onClick={() => { setSuccess(""); setStep(!step); }}>Previous</Button>
                        }
                        {!success &&
                        <div>
                             {fileUpload.loaded && !step &&
                             <Button className="bt" onClick={() => updateStep()}>Next</Button>}
                             {fileUpload.loaded && step &&
                             <Button className="bt" onClick={() => updateStep()}>Create</Button>}

                            {!fileUpload.loaded && template.loaded &&
                             <Button className="bt" onClick={() =>  {
                                var host = window.location.hostname.replace('app.', '')
                                console.log(host)
                                Cookies.set('graph', template.template.bytes, { domain: host });
                                window.open(`https://ide.graphlinq.io/?loadGraph=${template.template.idgraphsTemplates}`, "_blank")
                             }}>Go to IDE</Button>}

                        </div>}

                        {/* {!success &&
                            <Button colorScheme="brand" onClick={() => updateStep()}>
                                {fileUpload.loaded && !step &&
                                <span>Next</span>}
                                {fileUpload.loaded && step &&
                                <span>Deploy</span>}
                                
                                {!fileUpload.loaded && step &&
                                <span>Go to IDE</span>}
                                { {step ? "Next" : "Create"} }
                            </Button>
                        } */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}