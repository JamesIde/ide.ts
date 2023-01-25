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
