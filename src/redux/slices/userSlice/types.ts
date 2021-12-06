import { UserData } from '@stacks/auth';

export interface UserState {
  profile: UserData | null;
  stxAddresses: {
    testnet: string;
    mainnet: string;
  };
}
