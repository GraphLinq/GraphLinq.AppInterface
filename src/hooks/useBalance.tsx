import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { utils, ethers } from 'ethers';
import { UPDATE_BALANCE } from '../redux/actions/index';
import { useActiveWeb3React } from '.';
import { useTokenContract } from './useContract';

export function useBalance() {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useDispatch();
  const tokenContract = useTokenContract(process.env.REACT_APP_GRAPHLINQ_TOKEN_CONTRACT);
  const windowObject: any = window;
  const provider = new ethers.providers.Web3Provider(windowObject.ethereum);

  const balance = useSelector(state => (state as any).modals.balance);

  const refreshBalance = useCallback(async () => {
    if (!account || !tokenContract) {
      return;
    }
    try {
      const balanceOf = (chainId === parseInt(process.env.REACT_APP_GLQ_CHAIN_ID)) ? await provider.getBalance(account) : await tokenContract.balanceOf(account);

      if (!balanceOf) return;

      const balance = parseFloat(utils.formatUnits(balanceOf, 18));
      dispatch({ type: UPDATE_BALANCE, payload: { balance }, name: 'balance' });
    } catch (e) { console.error(e) }
  }, [account, tokenContract]);

  return { balance, refreshBalance }
}
