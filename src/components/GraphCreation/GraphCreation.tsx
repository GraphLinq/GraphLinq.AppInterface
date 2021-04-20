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
    // const templates = [
    //     {
    //         imageUrl: "https://via.placeholder.com/200x100.png",
    //         imageAlt: "Watch over bitcoin price on Coingecko",
    //         templateTitle: "Watcher Coingecko Bitcoin Price",
    //         radioValue: "watcher-coingecko-btc-price",
    //         bytes: "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"
    //     },
    //     {
    //         imageUrl: "https://via.placeholder.com/200x100.png",
    //         imageAlt: "Watch ethereum gas price in real time",
    //         templateTitle: "Watcher Gas price From Ethereum Chain",
    //         radioValue: "watcher-eth-gas-fees",
    //         bytes: "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"
    //     },
    //     {
    //         imageUrl: "https://via.placeholder.com/200x100.png",
    //         imageAlt: "Watch events from every new blocks received on the Ethereum Chain",
    //         templateTitle: "Watch New Ethereum Blocks",
    //         radioValue: "watcher-eth-new-blocks",
    //         bytes: "Fg8AAB+LCAAAAAAAAAPcVtuO2zYQ/RVDz6ZBSqRIGtiXboIWaJA1mk1eisAYksONEFkOdNnGCPrvHdnyZddxoqR5yAYGDIu0yJkz55yZT0kFK0zmyU01eYn/TH4r1/59k0yTah2wSeZ/f0qKQNuAOkStUya94ExqpZjtH6PBLEofszTL6a1286E/7Hn77npdVejbYl3R8rprl/2BybzqynKaeKiWDpf4EX3XIp0foWxwtz4sJvO27mgp1gVWodwshzjpaKyxW02GC9Y1ne/6qJfD5f5kY/kxmQth6ccmmedymhTV8gPUdFSL9Ul6GNNUBi6YyjgymfGMGZVnTCMGQ5vcq9CDsouhq8tjrq82TYur2au2Lqq76WR4XNTFPbQ4u17X+KJw08kbuo/AuJIz3n+mk+uubLsaryrs2hrK6WTRubLwf+Lmdv0eqyvt0RsVtEPQ2hqkG++h7A4YQtMUd9UKq5aCSE6fB6iT/RvLolnWGAm2yuOA9b/TIXOdGpciB+ZAUHW58AxEDoxnFqUHJW1qj5k3hDO2r3+B/N/uWPk5MvDceA8BmPL0JbUnrhvrmAwpFxacC+4EEn9K9AGTlxTAVkmzRdndFdVsz9pZv9PMHuhjOrn49yNsYixsPTg/GqoDWSSILA0ERaYFIaNIMFQZxYRAUNGkItfhiMJNRY6yzev5Pd3VZ/nACxIRorEEKRM8EvcyC8xYUAwyLjHaTAXVm8r/cAtytYNhbCN5bBbYRzYYhcz5ziiMvWgUgexABYHMWshJLpYzJzgnozCGbMPmHMyXufFT6GUkxc+JMrIPfJfuUkhzH4RjGDNBdICMOe09U6kX0hoXjfZHbN1Qzr3kcC+xvxbXvYBmz25vmtm26KSw090juNnMjAPX6NyAslKbHBzIH25GB4VFh8Gi54x6TiSF9YXJ0TLNIQad5RSHPCb9O7bbBG9rqBrYEm1xAPZMb9/Qe4e1x3Ki+3Yymhyveayo2FV7xveiyu3QfYXJL6qKFBVchlRq6SSxymnmXCqZ8GQRyCWBYp5C5Ucy+JwdI431u2QVwZC/5hSUIlwl5oaBd56FmLqIOc9QwxHcO2heNxjO/OoZ+mLV4/NUGvz0MLkGB15LxsETtNw4GnAsMqqnttoCSmUfpP+iWBXtr5O/7hls8sCCBN53LOKkolEvKim1CDyk1j3S1h/QvHv6ABxNdeScMeRLiX1mWLlgnruxY8Qksj31K14puFQ7s5T8oleCySJQp2UAvVcC0MCOJGxOJgWKK+7EiZxX2DRwhz/Z+DGSk+cFH9kev80n3/arfr3qL9o9/wcAAP//AwB9nA4pFg8AAA=="
    //     },
    //     {
    //         imageUrl: "https://via.placeholder.com/200x100.png",
    //         imageAlt: "Watch over a pair on pancake and get notified on new swaps",
    //         templateTitle: "Pancake Swap Pair Watcher",
    //         radioValue: "watcher-pancake-pair-watcher",
    //         bytes: "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"
    //     },
    //     {
    //         imageUrl: "https://via.placeholder.com/200x100.png",
    //         imageAlt: "Watch new deposit on UniCrypt platform",
    //         templateTitle: "Watch Unicrypt New Deposit",
    //         radioValue: "watcher-unicrypt-new-deposit",
    //         bytes: "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"
    //     },
    // ];

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
                            <Alert
                                style={{ marginBottom: "15px", marginTop: "15px" }}
                                status="success"
                                variant="subtle"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                height="200px"
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Graph Successfully started, Congratulations!
                                </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    {graphName} execution unique hash :
                                    <Text fontSize="xs" px="2">
                                        <span style={{ color: "blue" }}>{success}</span>
                                    </Text>
                                </AlertDescription>
                            </Alert>
                        }
                        {error &&
                            <Alert style={{ marginBottom: "15px", marginTop: "15px" }} status="error">
                                <AlertIcon />{error}
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

                        <Alert style={{ marginTop: 15, marginBottom: 15 }} status="info">
                            <AlertIcon />
                            <p>Template system are still in development, you can import a GLQ file generated directly from our <a style={{ color: 'blue' }} target="_blank" href="https://ide.graphlinq.io">IDE</a> (File -&gt; Save Graph). </p>
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