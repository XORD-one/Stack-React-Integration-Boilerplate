import { STX_DECIMALS } from '../constant';

export const getStxDecimals = () => Math.pow(10, STX_DECIMALS);

export const convertExponentToPlainNumber = (number: number) => {
  return Math.floor(parseFloat(String(number).split('e')[0]));
};
