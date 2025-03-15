export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  id: string;
  name: string;
  email_verified: boolean;
  providerId: string;
  picture: string;
  sub: string;
  QcP?: Date;
  tokenVersion: number;
  exp?: number;
}

export interface AccessTokenSuccess {
  ok: boolean;
  token: string;
}

export interface LogoutSuccess {
  ok: boolean;
}

export interface GoogleToken {
  code: string;
  authuser: number;
  prompt: string;
  scope: string;
}

export interface GoogleOAuthTokenSuccess {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface GoogleProfile {
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  id: string;
}
