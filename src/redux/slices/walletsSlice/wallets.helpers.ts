import stacksFetch from '../../../api/stacksFetch';
import {
  convertExponentToPlainNumber,
  getReadOnlyFunctionUrl,
} from '../../../utils';
import { Token } from './wallets.types';
import { cvToValue, parseReadOnlyResponse } from '@stacks/transactions';

export const extractTokenContractNameAndAddress = (str: string) => {
  return {
    address: str.split('.')[0],
    contractName: str.split('.')[1].split('::')[0],
  };
};

export const getTokenDecimals = async (
  token: Omit<Token, 'balance'>,
  userAddress: string,
): Promise<number> => {
  const { data } = await stacksFetch.post(
    `v2/contracts/call-read/${token.address}/${token.name}/get-decimals`,
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
): Promise<any> => {
  const body = {
    sender: userAddress,
    arguments: [],
  };

  const promises = ['get-decimals', 'get-symbol', 'get-name'].map(routeName =>
    stacksFetch.post(
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
