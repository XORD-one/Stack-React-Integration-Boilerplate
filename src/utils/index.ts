import { STX_DECIMALS } from '../constant';

export const getStxDecimals = () => Math.pow(10, STX_DECIMALS);

export const convertExponentToPlainNumber = (number: number) => {
  return Math.floor(parseFloat(String(number).split('e')[0]));
};

export const getReadOnlyFunctionUrl = (
  address: string,
  name: string,
  functionName: string,
) => `v2/contracts/call-read/${address}/${name}/${functionName}`;
