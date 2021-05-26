import React, { useEffect } from 'react'
import { Image } from '@chakra-ui/react';
import { useWeb3React } from "@web3-react/core";
import Trophy from "../assets/trophy.png"
import T1 from "../assets/t1.gif"
import T2 from "../assets/t2.gif"
import T3 from "../assets/t3.gif"

const GLQRate = 715000

const Staking = () => {

    return (
        <>
            <div id="stk">
               <header>
                   <div>
                       <h1>Staking Dashboard</h1>
                       <p>By staking your GLQ you earn rewards and help keep the Graphlinq Network secure.</p>
                   </div>
                   <div>
                       <button className="bt btm">Stake now</button>
                   </div>
               </header>
               <div className="stk-m">
                   <div>
                       <div className="stk-p">
                           <div className="stk-pt">
                               <Image src={Trophy}/>
                               <div>
                                   <div className="sub">Your position</div>
                                   <div className="pos"><strong>247</strong><small>/ 15478</small></div>
                                   <div className="rank"></div>
                               </div>    
                               <div className="evol">
                                   <strong>158</strong>
                                   <small>Last week</small>
                               </div>
                           </div>
                           <div className="stk-pc">
                                <table>
                                    <tr>
                                        <th></th>
                                        <th><span className="sub">Top 3 stakers</span></th>
                                    </tr>
                                    <tr>
                                        <td><Image src={T1}/></td>
                                        <td>  
                                            <div className="ladd">
                                                <div>0e...A4D5X6S94D45</div>
                                                <div><strong>148,15489,584</strong> GLQ</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Image src={T2}/></td>
                                        <td>  
                                            <div className="ladd">
                                                <div>0e...A4D5X6S94D45</div>
                                                <div><strong>148,15489,584</strong> GLQ</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Image src={T3}/></td>
                                        <td>  
                                            <div className="ladd">
                                                <div>0e...A4D5X6S94D45</div>
                                                <div><strong>148,15489,584</strong> GLQ</div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                           </div>
                       </div>
                       <div className="stk-pe">
                           <div>
                               <div className="sub">My total supply</div>
                               <p>
                                   <strong>0</strong> GLQ
                                   <small>$0.00</small>
                               </p>
                           </div>
                           <div>
                               <div className="sub">My supply</div>
                               <p>
                                   <strong>0</strong> GLQ
                                   <small>$0.00</small>
                               </p>
                           </div>
                           <div>
                               <div className="sub">My claimable rewards</div>
                               <p>
                                   <strong>0</strong> GLQ
                                   <small>$0.00</small>
                               </p>
                           </div>
                       </div>
                   </div>
                   <div>
                       <ul className="uln">
                           <li>
                               <div className="sub">Total delegated stake</div>
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
                               <div className="sub">Delegated stake</div>
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
                               <div className="sub">Top up stake</div>
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
                       <p className="intr">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas deserunt numquam quos incidunt.</p>
                   </div>
               </div>
               <div className="stkb">
                   <div className="tier">
                       <h2>Tiers ranking</h2>
                       <div>
                           <div className="tro">
                               <div className="sub">Tier 1</div>
                               <strong>0,00%</strong>
                           </div>
                       </div>
                       <div>
                           <div className="tro">
                               <div className="sub">Tier 2</div>
                               <strong>0,00%</strong>
                           </div>
                       </div>
                       <div>
                           <div className="tro act">
                               <div className="sub">Tier 3</div>
                               <strong>0,00%</strong>
                           </div>
                       </div>
                   </div>
                   <div className="depo">
                       <div>
                           <div className="sub">Deposit</div>
                           <form>
                               <div className="inp val in">
                                   <input type="text" placeholder="0.00"/>
                               </div>
                               <button className="bt">Deposit</button>
                               <button className="bt">Withdraw</button>
                           </form>
                       </div>
                   </div>
                </div>
            </div>
        </>
    );
}

export default Staking;