import { UserData } from '@stacks/auth';

export interface ProfileState extends UserData {
  privateKey: string;
  publicKeys: string[];
  did: string;
}

export interface UserState {
  profile: ProfileState | null;
  stxAddresses: {
    testnet: string;
    mainnet: string;
  };
}
