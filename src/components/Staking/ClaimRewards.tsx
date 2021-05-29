import React from "react";
import { createStandaloneToast } from "@chakra-ui/react";
import { ToastSuccess } from "../Toasts/ToastSuccess";
import { ToastError } from "../Toasts/ToastError";
import { ToastWarning } from "../Toasts/ToastWarning";
import { ToastInfo } from "../Toasts/ToastInfo";

import { useStakingContract } from "../../hooks/useContract";

interface ClaimRewardsProps {
    claimable: any;
    waitingPercentAPR: any;
    error: any;
    setError: any;
    pending: any;
    setPending: any;
    success: any;
    setSuccess: any;
}

export const ClaimRewards: React.FC<ClaimRewardsProps> = (props) => {
    const toast = createStandaloneToast();
    const stakingContract = useStakingContract(process.env.REACT_APP_STAKING_CONTRACT);

    async function doClaim() {
        if (stakingContract == null) {
            return;
        }
        try {
            if (props.claimable <= 0) {
                props.setError(`Nothing to claim.`);
                toast({
                    position: "bottom-right",
                    render: () => <ToastError description="Nothing to claim." />,
                });
                return;
            }
            const result = await stakingContract.claimGlq();
            props.setPending("Waiting for confirmations...");
            toast({
                position: "bottom-right",
                render: () => <ToastInfo description="Waiting for confirmations..." />,
            });
            await result.wait();
            console.log(result);
            if (result instanceof String) {
                props.setPending("");
                props.setError(result.toString());
                toast({
                    position: "bottom-right",
                    render: () => <ToastError description={result.toString()} />,
                });
                return;
            }
            props.setPending("");
            props.setError("");
            props.setSuccess(result.hash);
            toast({
                position: "bottom-right",
                render: () => <ToastSuccess description="Reward successfully claimed !" />,
            });
        } catch (e) {
            if (e.data?.originalError.message) {
                props.setPending("");
                props.setError(`Error: ${e.data?.originalError.message}`);
                toast({
                    position: "bottom-right",
                    render: () => <ToastError description={`Error: ${e.data?.originalError.message}`} />,
                });
                return;
            }
            if (e.message) {
                props.setPending("");
                props.setError(`Error: ${e.message}`);
                toast({
                    position: "bottom-right",
                    render: () => <ToastError description={`Error: ${e.message}`} />,
                });
            }
        }
    }

    return (
        <>
            <div className="sub">My claimable rewards</div>
            <p>
                <strong>{props.claimable.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</strong> GLQ
                <small>$0.00</small>
                <button style={{ marginTop: 10, marginBottom: 10 }} className="bt" onClick={doClaim}>
                    Claim Rewards
                </button>
                <small>~ {props.waitingPercentAPR}% of staked GLQ</small>
            </p>
        </>
    );
};
