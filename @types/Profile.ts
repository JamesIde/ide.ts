// Incoming google token
export interface OAuthToken {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
  provider?: string;
}

// User returned from database
export interface IdpUser {
  id: string;
  email: string;
  name: string;
  email_verified: boolean;
  providerId: string;
  iss: string;
  picture: string;
  tokenVersion: number;
  given_name: string;
  family_name: string;
}

// 'Safe' user model returned to client
export interface User {
  id: string;
  email: string;
  name: string;
  email_verified: boolean;
  providerId: string;
  picture: string;
  given_name: string;
  family_name: string;
  token: string;
}
