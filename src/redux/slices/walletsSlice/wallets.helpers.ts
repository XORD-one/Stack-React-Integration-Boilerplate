import stacksFetch from '../../../api/stacksFetch';
import { convertExponentToPlainNumber } from '../../../utils';
import { Token } from './wallets.types';
import { cvToValue, parseReadOnlyResponse } from '@stacks/transactions';
import { getReadOnlyFunctionUrl } from '../../../api/endpoints';
import { FetchInstance } from '../fetchSlice/fetch.types';

export const extractTokenContractNameAndAddress = (str: string) => {
  return {
    address: str.split('.')[0],
    contractName: str.split('.')[1].split('::')[0],
  };
};

export const getTokenDecimals = async (
  token: Omit<Token, 'balance'>,
  userAddress: string,
  fetchInstance: FetchInstance,
): Promise<number> => {
  const { data } = await fetchInstance.post(
    getReadOnlyFunctionUrl(token.address, token.contractName, 'get-decimals'),
    {
      sender: userAddress,
      arguments: [],
    },
  );

  return convertExponentToPlainNumber(parseInt(data.result, 16));
};

export const getTokenInfo = async (
  token: Omit<Token, 'balance' | 'name' | 'symbol'>,
  userAddress: string,
  fetchInstance: FetchInstance,
): Promise<any> => {
  const body = {
    sender: userAddress,
    arguments: [],
  };

  const promises = ['get-decimals', 'get-symbol', 'get-name'].map(routeName =>
    fetchInstance.post(
      getReadOnlyFunctionUrl(token.address, token.contractName, routeName),
      body,
    ),
  );

  const [decimalsResponse, symbolResponse, nameResponse] = await Promise.all(
    promises,
  );

  return {
    decimals: convertExponentToPlainNumber(
      parseInt(decimalsResponse.data.result, 16),
    ),
    name: cvToValue(parseReadOnlyResponse(nameResponse.data)).value,
    symbol: cvToValue(parseReadOnlyResponse(symbolResponse.data)).value,
  };
};
