import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Image } from '@chakra-ui/react';
import { useWeb3React } from "@web3-react/core";
import Trophy from "../assets/trophy.png"
import T1 from "../assets/t1.gif"
import T2 from "../assets/t2.gif"
import T3 from "../assets/t3.gif"
import { useActiveWeb3React } from '../hooks/index';

import { useStaking } from '../hooks/useStaking';
import { useStakingContract } from '../hooks/useContract';

import { SuspenseSpinner } from '../components/SuspenseSpinner';
import { BigNumber } from '@ethersproject/bignumber';
import TiersAPY from '../contracts/objects/tiersAPY';
import { utils } from 'ethers';
import TopStakers, { Staker } from '../contracts/objects/topStakers';

const Staking = () => {

    const { account } = useActiveWeb3React()
    const [loaded, setLoaded] = useState(false)
    const [tiersAPY, setTiersAPY] = useState<TiersAPY | undefined>(undefined)
    const [topStakers, setTopStakers] = useState<TopStakers | undefined>(undefined)
    const [rank, setRank] = useState(0)
    const [stakers, setStakers] = useState(0)
    const [totalStaked, setTotalStaked] = useState(0)
    const [claimable, setClaimable] = useState(0)
    const [waitingPercentAPR, setWaitingPercentAPR] = useState(0)
    const [walletTier, setWalletTier] = useState(3)
    const stakingContract = useStakingContract(process.env.REACT_APP_STAKING_CONTRACT)

    const {balance, refreshBalance} = useStaking()

    useEffect(() => {
        refreshBalance()

        const refreshTiersAPY = async() => {
            return new Promise(async (res: any, _: any) => { 
                if (stakingContract == null) { return ;} 
                const tiers: BigNumber[] = await stakingContract.getTiersAPY()
                setTiersAPY(new TiersAPY(tiers))
                res()
            })
        }

        const refreshRankPosition = async() => {
            return new Promise(async (res: any, _: any) => { 
                if (stakingContract == null) { return ;} 
                try {
                    const rank: number = (await stakingContract.getPosition(account)).toString()
                    setRank(rank)
                } catch(e) {console.error(e)}
                res()
            })
        }

        const refreshTotalStakers = async() => {
            return new Promise(async (res: any, _: any) => { 
                if (stakingContract == null) { return ;} 
                const stakers: number = (await stakingContract.getTotalStakers()).toString()
                setStakers(stakers)
                res()
            })
        }

        const refreshClaimable = async() => {
            return new Promise(async (res: any, _: any) => { 
                if (stakingContract == null) { return ;} 
                try {
                    const claimable: number = (await stakingContract.getGlqToClaim(account)).toString()
                    setClaimable(parseFloat(utils.formatUnits(claimable, 18)))
                } catch(e) {console.error(e)}
      
                res()
            })
        }

        const refreshTotalStaked = async() => {
            return new Promise(async (res: any, _: any) => { 
                try {
                    if (stakingContract == null) { return ;} 
                    const totalStaked: number = (await stakingContract.getTotalStaked()).toString()
                    setTotalStaked(parseFloat(utils.formatUnits(totalStaked, 18)))
                } catch(e) {console.error(e)}
                res()
            })
        }

        const refreshWaitingPercentAPR = async() => {
            return new Promise(async (res: any, _: any) => { 
                if (stakingContract == null) { return ;} 
                try {
                    const percent: number = (await stakingContract.getWaitingPercentAPR(account)).toString()
                    setWaitingPercentAPR(parseFloat(utils.formatUnits(percent, 18)))
                 } catch(e) {console.error(e)}
                res()
            })
        }
        
        const refreshWalletCurrentTier = async() => {
            return new Promise(async (res: any, _: any) => { 
                if (stakingContract == null) { return ;} 
                try {
                    const tier: number = (await stakingContract.getWalletCurrentTier(account)).toString()
                    setWalletTier(tier)
                } catch(e) {console.error(e)}
                res()
            })
        }

        const refreshTopStakers = async() => {
            return new Promise(async (res: any, _: any) => { 
                if (stakingContract == null) { return ;} 
                const datas: any = await stakingContract.getTopStakers()
                const stakers: TopStakers = new TopStakers(datas[0], datas[1])

                setTopStakers(stakers)
                res()
            })
        }

        const loadDatas = async() => {
            await refreshTiersAPY()
            await refreshRankPosition()
            await refreshTotalStakers()
            await refreshClaimable()
            await refreshTotalStaked()
            await refreshWaitingPercentAPR()
            await refreshWalletCurrentTier()
            await refreshTopStakers()

            setLoaded(true)
        }

        loadDatas()
    }, [])

    return (
        <>
            <div id="stk">
               <header>
                   <div>
                       <h1>Staking Dashboard</h1>
                       <p>Stake now your GLQ, earn rewards and participate in the community activities.</p>
                   </div>
               </header>

                {!loaded && 
                <div style={{margin:50}}><SuspenseSpinner/></div>}

                {loaded && <div>
                <div className="stk-m">
                    <div>
                        <div className="stk-p">
                            <div className="stk-pt">
                                <Image src={Trophy}/>
                                <div>
                                    <div className="sub">Your ranking position</div>
                                    <div className="pos"><strong>{rank}</strong><small>/ {stakers}</small></div>
                                    <div className="rank"></div>
                                </div>    
                                <div className="evol">
                                    <strong>Tier {walletTier}</strong>
                                    <small>Current Rank</small>
                                </div>

                                <div className="evol1">
                                    <strong>214 Ahead</strong>
                                    <small>Until Next Rank</small>
                                </div>
                            </div>
                            <div className="stk-pc">
                                    <table>
                                        <tr>
                                            <th></th>
                                            <th><span className="sub">Top 3 stakers</span></th>
                                        </tr>
                                        {topStakers !== undefined &&
                                        topStakers.stakers.map((staker: Staker) => {
                                            return (
                                            <tr>
                                            <td><Image src={T1}/></td>
                                            <td>  
                                                <div className="ladd">
                                                    <div>{staker.wallet}</div>
                                                    <div><strong>{staker.amount}</strong> GLQ</div>
                                                </div>
                                            </td>
                                        </tr>)
                                        })}
                                    </table>
                            </div>
                        </div>
                        <div className="stk-pe">
                            <div style={{marginTop:30}}>
                                <div className="sub">Total Staked GLQ</div>
                                <p>
                                    <strong>{totalStaked.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</strong> GLQ
                                    <small>$0.00</small>
                                </p>
                            </div>
                            <div>
                                <div className="sub">My staked GLQ</div>
                                <p>
                                    <strong>{balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</strong> GLQ
                                    <small>$0.00</small>
                                    <button style={{marginTop: 20}} className="bt">Withdraw</button>
                                </p>
                            </div>
                            <div>
                                <div className="sub">My claimable rewards</div>
                                <p>
                                    <strong>{claimable.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</strong> GLQ
                    
                                    <small>$0.00</small>
                                    <button style={{marginTop: 10, marginBottom: 10}} className="bt">Claim Rewards</button>
                                    <small>~ {waitingPercentAPR}% of staked GLQ</small>
                                </p>
                                
                            </div>
                        </div>
                    </div>
                    <div>
                        <ul className="uln">
                            <li>
                                <div className="sub">Total Staked Tier 1</div>
                                <div className="nmb">
                                    <div>
                                        <strong>10,577,499</strong> GLQ
                                    </div>
                                    <div></div>
                                    <div>
                                        <strong>$ 969,516,515.15</strong>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="sub">Total Staked Tier 2</div>
                                <div className="nmb">
                                    <div>
                                        <strong>10,577,499</strong> GLQ
                                    </div>
                                    <div></div>
                                    <div>
                                        <strong>$ 969,516,515.15</strong>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="sub">Total Staked Tier 3</div>
                                <div className="nmb">
                                    <div>
                                        <strong>10,577,499</strong> GLQ
                                    </div>
                                    <div></div>
                                    <div>
                                        <strong>$ 969,516,515.15</strong>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <p className="intr">You can stake your GLQ and get rewards claimable in real-time, the more you HODL and the more you rank will top-up to get to the next tier.<br/><br/>
                        <u>At each withdraw, you will lose your rank advantage in a way to thanks our most active members.</u><br/>
                        First withdraw will cut 50% of your APY (if you're not in Tier 3), then, the second one will reset your rank to the last place.</p>
                    </div>
                </div>
                <div className="stkb">

                    <div className="tier">
                        <h2>Tiers ranking</h2>
                        <div title={walletTier == 1 ? "You're current tier rewards": ""}>
                            <div className={walletTier == 1 ? "tro act": "tro"}>
                                <div className="sub">Tier 1</div>
                                <strong>{tiersAPY?.tier_1.toFixed(2)} %</strong>
                            </div>
                        </div>
                        <div title={walletTier == 2 ? "You're current tier rewards": ""}>
                            <div className={walletTier == 2 ? "tro act": "tro"}>
                                <div className="sub">Tier 2</div>
                                <strong>{tiersAPY?.tier_2.toFixed(2)} %</strong>
                            </div>
                        </div>
                        <div title={walletTier == 3 ? "You're current tier rewards": ""}>
                            <div className={walletTier == 3 ? "tro act": "tro"}>
                                <div className="sub">Tier 3</div>
                                <strong>{tiersAPY?.tier_3.toFixed(2)} %</strong>
                            </div>
                        </div>
                    </div>

                    <div className="depo">
                        <div>
                            <div className="sub">Stake your GLQ</div>
                            <form>
                                <div className="inp val in">
                                    <input type="text" placeholder="0.00"/>
                                </div>
                                <button className="bt">Stake now</button>
                            </form>
                        </div>
                    </div>
                    </div>
                </div>}


            </div>
        </>
    );
}

export default Staking;