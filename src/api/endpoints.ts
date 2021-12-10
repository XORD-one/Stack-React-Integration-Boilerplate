export const getReadOnlyFunctionUrl = (
  address: string,
  name: string,
  functionName: string,
) => `v2/contracts/call-read/${address}/${name}/${functionName}`;

export const getAccountBalanceUrl = (address: string) =>
  `extended/v1/address/${address}/balances`;

export const getAccountTransactionsUrl = (address: string) =>
  `extended/v1/address/${address}/transactions`;

export const getContractAbi = (address: string, name: string) =>
  `v2/contracts/interface/${address}/${name}`;
