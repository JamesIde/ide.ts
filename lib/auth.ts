import { IdpUser, User } from "../@types/Profile";
import * as jwt from "jsonwebtoken";
import { JWTPayload } from "../@types/Token";
export function getTokenFromStorage() {
  const user: User = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return null;
  }
  const token = user.token;
  return token;
}

export function generateAccessToken(profile: IdpUser) {
  let expiration = 15 * 60 * 1000;
  let ATime = new Date(Date.now() + expiration);
  let ATPayload: JWTPayload = {
    id: profile.id,
    name: profile.name,
    email_verified: profile.email_verified,
    providerId: profile.providerId,
    picture: profile.picture,
    sub: profile.email,
    QcP: ATime,
    tokenVersion: profile.tokenVersion,
    exp: ATime.getTime(),
  };

  return jwt.sign(ATPayload, process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET);
}

export function generateRefreshToken(profile: IdpUser) {
  // Different payloads for different tokens
  let expiration = 365 * 24 * 60 * 60 * 1000;
  let RTime = new Date(Date.now() + expiration);

  let RTPayload: JWTPayload = {
    id: profile.id,
    name: profile.name,
    email_verified: profile.email_verified,
    providerId: profile.providerId,
    picture: profile.picture,
    sub: profile.email,
    QcP: RTime,
    tokenVersion: profile.tokenVersion,
  };

  return jwt.sign(RTPayload, process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET);
}
