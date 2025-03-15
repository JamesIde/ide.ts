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
  picture: string;
}
