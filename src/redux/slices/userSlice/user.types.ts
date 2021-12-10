import { UserData } from '@stacks/auth';

export interface ProfileState extends UserData {
  privateKey: string;
  publicKeys: string[];
}

export interface UserState {
  profile: ProfileState | null;
  stxAddresses: {
    testnet: string;
    mainnet: string;
  };
}
