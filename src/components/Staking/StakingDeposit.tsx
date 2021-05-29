import React, { useState } from "react";
import { Alert, createStandaloneToast, Image, Spacer, Spinner } from "@chakra-ui/react";
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
    refreshStakingBalance: any;
}

export const StakingDeposit: React.FC<StakingDepositProps> = (props: any) => {
    const { account } = useActiveWeb3React();
    const { balance, refreshBalance } = useBalance();
    const [amountToStake, setAmountToStake] = useState("");
    const toast = createStandaloneToast();
    const [error, setError] = useState("");
    const [pending, setPending] = useState("");
    const [success, setSuccess] = useState("");

    const stakingContract = useStakingContract(process.env.REACT_APP_STAKING_CONTRACT);
    const tokenContract = useTokenContract(process.env.REACT_APP_GRAPHLINQ_TOKEN_CONTRACT);

    const { refreshBalanceContract } = useWalletContract();

    async function doStake(e: any) {
        e.preventDefault();
        if (stakingContract == null || tokenContract == null) {
            return;
        }
        refreshBalance();

        const asNumber: number = parseFloat(amountToStake);
        if (asNumber <= 0) {
            setError(`Invalid amount to deposit on the staking contract: ${asNumber} GLQ`);
            toast({
                position: "bottom-right",
                render: () => <ToastError description={`Invalid amount to deposit on the staking contract: ${asNumber} GLQ`} />,
            });
            return;
        }

        const decimalAmount: any = utils.parseEther(amountToStake);
        try {
            const allowance = await tokenContract.allowance(account, process.env.REACT_APP_STAKING_CONTRACT);
            const wei = utils.parseEther("10000000");
            if (parseFloat(allowance) < parseFloat(decimalAmount)) {
                setPending("Allowance pending, please allow the use of your token balance for the contract...");
                toast({
                    position: "bottom-right",
                    render: () => <ToastWarning description="Allowance pending, please allow the use of your token balance for the contract..." />,
                });
                const approveTx = await tokenContract.approve(process.env.REACT_APP_STAKING_CONTRACT, wei.toString());
                setPending("Waiting for confirmations...");
                toast({
                    position: "bottom-right",
                    render: () => <ToastInfo description="Waiting for confirmations..." />,
                });
                await approveTx.wait();
                setPending("Allowance successfully increased, waiting for deposit transaction...");
                toast({
                    position: "bottom-right",
                    render: () => <ToastSuccess description="Allowance successfully increased, waiting for deposit transaction..." />,
                });
            }
            const currentBalanceDecimal: any = utils.parseEther(balance.amount.toString());
            if (parseFloat(decimalAmount) > parseFloat(currentBalanceDecimal)) {
                setPending("");
                setError(`You only have ${balance.amount} GLQ in your wallet.`);
                toast({
                    position: "bottom-right",
                    render: () => <ToastError description={`You only have ${balance.amount} GLQ in your wallet.`} />,
                });
                return;
            }

            setPending("Pending, check your wallet extension to execute the chain transaction...");
            toast({
                position: "bottom-right",
                render: () => <ToastWarning description="Pending, check your wallet extension to execute the chain transaction..." />,
            });
            const result = await stakingContract.depositGlq(decimalAmount.toString());
            setPending("Waiting for confirmations...");
            toast({
                position: "bottom-right",
                render: () => <ToastInfo description="Waiting for confirmations..." />,
            });
            await result.wait();
            setSuccess(result.hash);
            toast({
                position: "bottom-right",
                render: () => <ToastSuccess title="Deposit successfully completed !" description={result.hash} isLink />,
            });

            refreshBalanceContract();
            props.refreshStakingBalance();
        } catch (e) {
            console.error(e);
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
                        Deposit successfully completed !
                        <br />
                        <small>
                            Transaction hash :{" "}
                            <a href={`https://etherscan.com/tx/${success}`} target="_blank">
                                {success}
                            </a>
                        </small>
                    </p>
                </Alert>
            )}
            <div className="inp val in">
                <input
                    type="number"
                    placeholder="0.00"
                    value={amountToStake}
                    onChange={(e) => {
                        setAmountToStake(e.target.value);
                    }}
                />
            </div>
            <button className="bt" onClick={doStake}>
                Stake now
            </button>
        </form>
    );
};
