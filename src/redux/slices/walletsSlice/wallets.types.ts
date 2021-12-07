export type Token = {
  contractName: string;
  address: string;
  balance: number;
  name: string;
  symbol: string;
};

export interface WalletsState {
  stxBalance: number;
  tokensInWallet: Token[];
  totalAssetsBalance: number;
}
