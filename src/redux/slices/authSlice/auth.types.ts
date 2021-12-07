import { UserSession } from '@stacks/connect';

export interface AuthState {
  authToken: string;
  session: UserSession | null;
  isConnected: boolean;
}
