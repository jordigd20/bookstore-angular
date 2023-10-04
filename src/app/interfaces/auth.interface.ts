import { User } from "./user.interface";

export interface AuthState {
  user: User | null;
  token: string | null;
  loaded: boolean;
  error: string | null;
}

export interface AuthUser {
  user: User;
  token: string;
}

export interface GoogleSigninResponse {
  clientId: string;
  client_id: string;
  credential: string;
  select_by: string;
}
