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
  iat?: Date;
  QcP: Date;
  tokenVersion: number;
  exp?: number;
}

export interface AccessTokenSuccess {
  ok: true;
  token: string;
}
