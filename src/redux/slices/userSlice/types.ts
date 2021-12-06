import { AuthResponsePayload, UserSession } from '@stacks/connect';

export interface UserState {
  authToken: string;
  session: UserSession | null;
  profile: AuthResponsePayload | null;
  stxAddresses: {
    testnet: string;
    mainnet: string;
  };
}
