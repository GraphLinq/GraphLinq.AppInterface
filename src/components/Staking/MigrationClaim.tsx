import React, { useState } from "react";
import {
    Alert,
    Button,
    chakra,
    createStandaloneToast,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    NumberInput,
    NumberInputField,
    Spacer,
    Spinner,
} from "@chakra-ui/react";
import { ToastSuccess } from "../Toasts/ToastSuccess";
import { ToastError } from "../Toasts/ToastError";
import { ToastWarning } from "../Toasts/ToastWarning";
import { ToastInfo } from "../Toasts/ToastInfo";

import { useActiveWeb3React } from "../../hooks/index";
import { useStakingContract, useTokenContract } from "../../hooks/useContract";
import { useBalance } from "../../hooks/useBalance";
import { useWalletContract } from "../../hooks/useWalletContract";
import { utils } from "ethers";

interface StakingDepositProps {
    tx: number;
    setTx: any;
    claimAmount: any;
}

export const MigrationClaim: React.FC<StakingDepositProps> = (props: any) => {
    const { account } = useActiveWeb3React();
    const { balance, refreshBalance } = useBalance();
    const [amountToStake, setAmountToStake] = useState(0);
    const toast = createStandaloneToast();
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");

    const stakingContract = useStakingContract(process.env.REACT_APP_MIGRATION_STAKING_CONTRACT);
    const tokenContract = useTokenContract(process.env.REACT_APP_GRAPHLINQ_TOKEN_CONTRACT);

    const { refreshBalanceContract } = useWalletContract();

    const format = (val: string) => val + ` GLQ`;
    const parse = (val: string) => val.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1");

    const maxAmount = () => {
        setAmountToStake(Math.floor(balance.amount));
    };

    async function doClaim(e: any) {
        e.preventDefault();
        if (stakingContract == null || tokenContract == null) {
            return;
        }
        refreshBalance();

        try {

            setPending("Pending, check your wallet extension to execute the chain transaction...");
            toast({
                position: "bottom-right",
                render: () => <ToastWarning description="Pending, check your wallet extension to execute the chain transaction..." />,
            });
            const result = await stakingContract.claimFromMigration();

            setPending("Waiting for confirmations...");
            toast({
                position: "bottom-right",
                render: () => <ToastInfo description="Waiting for confirmations..." />,
            });
            const txReceipt = await result.wait();
            if (txReceipt.status === 1) {
                setSuccess(txReceipt.transactionHash);
                toast({
                    position: "bottom-right",
                    render: () => <ToastSuccess title="GLQ successfully claimed!" description={txReceipt.transactionHash} isLink />,
                });
            }

            props.setTx(props.tx + 1);
            refreshBalanceContract();
        } catch (e) {
            //console.error(e);
            if (e.data?.message) {
                setPending("");
                setError(`Error: ${e.data?.message}`);
                toast({
                    position: "bottom-right",
                    render: () => <ToastError description={e.data?.message} />,
                });
                return;
            }
            if (e.message) {
                setPending("");
                setError(`Error: ${e.message}`);
                toast({
                    position: "bottom-right",
                    render: () => <ToastError description={e.message} />,
                });
            }
        }
    }

    return (
        <div>
        <form>
            {error && (
                <Alert status="error" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                    <i className="fal fa-times-circle"></i>
                    <p>{error}</p>
                </Alert>
            )}
            {!success && pending && (
                <Alert status="info" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                    <i className="fal fa-info-circle"></i>
                    <p>{pending}</p>
                    <Spacer />
                    <Spinner thickness="2px" speed="0.65s" emptyColor="#15122b" color="blue.600" size="md" />
                </Alert>
            )}
            {success && (
                <Alert status="success" className="mod" py="2rem" px="3rem" mx="auto" my="1rem">
                    <i className="fal fa-check-circle"></i>
                    <p>
                        Successfully completed !
                        <br />
                        <small>
                            Transaction hash :{" "}
                            <a href={`https://explorer.graphlinq.io/tx/${success}`} target="_blank">
                                {success}
                            </a>
                        </small>
                    </p>
                </Alert>
            )}
            <div>
                <InputGroup rounded="full">
                    <NumberInput
                        disabled={true}
                        className="in"
                        placeholder="0.00"
                        variant="unstyled"
                        onChange={(value) => {
                            if (value !== undefined) {
                                parse(value);
                                var parsed = parseFloat(value);
                                if (parsed >= 0) {
                                    setAmountToStake(parsed);
                                }
                            }
                        }}
                        value={format((props.claimAmount * 0.909091).toFixed(0))}
                        defaultValue={0.0}
                        min={0.0}
                    >
                        <NumberInputField />
                    </NumberInput>
                    <InputRightElement width="4.5rem" top="50%" transform="translateY(-50%)">
                    </InputRightElement>
                </InputGroup>
            </div>

            <span>Total claim value: <b>{(props.claimAmount)} GLQ </b>including the 10% bonus.</span><br/><br/>

            <button className="bt" onClick={doClaim}>
                Claim
            </button>

            
        </form><br/>
        Based on the total <b>{(props.claimAmount*0.909091).toFixed(2)} GLQ</b> you staked, you are also eligible to a GLQ bonus of <b>{((props.claimAmount*0.909091) * 0.10).toFixed(2)} GLQ</b> by clicking on the Claim button
        <br/>
        Once you claimed your native GLQ asset token on the GraphLinq Blockchain, you can restake directly on the new staking contract, we hope to see you there!
        <br/>
        </div>
    );
};
