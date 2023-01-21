import { IdpUser, User } from "../../@types/Profile";
import * as jwt from "jsonwebtoken";
import * as jose from "jose";
import { JWTPayload } from "../../@types/Token";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";

export async function generateAccessToken(profile: IdpUser) {
  let ATPayload = {
    id: profile.id,
    name: profile.name,
    email_verified: profile.email_verified,
    providerId: profile.providerId,
    picture: profile.picture,
    sub: profile.email,
    tokenVersion: profile.tokenVersion,
  };

  const secret = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET
  );
  const alg = "HS256";

  const token = await new jose.SignJWT(ATPayload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("10s")
    .setIssuer("jamesaide")
    .sign(secret);
  return token;
}

export async function generateRefreshToken(profile: IdpUser) {
  let RTPayload = {
    id: profile.id,
    name: profile.name,
    email_verified: profile.email_verified,
    providerId: profile.providerId,
    picture: profile.picture,
    tokenVersion: profile.tokenVersion,
  };

  const secret = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET
  );
  const alg = "HS256";

  const token = await new jose.SignJWT(RTPayload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setIssuer("jamesaide")
    .sign(secret);

  return token;
}

export async function validateToken(req: NextApiRequest, res: NextApiResponse) {
  if (!req.headers["authorization"]) {
    return res
      .status(403)
      .send({ ok: false, message: "No identity presented" });
  }
  const token = req.headers["authorization"].split(" ")[1];
  let decoded: any = null;
  try {
    decoded = jwt.verify(token, process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET);
    const token_payload = decoded as JWTPayload;
    const user = await prisma.user.findFirst({
      where: {
        providerId: token_payload.providerId,
      },
    });

    if (!user) {
      return res
        .status(403)
        .send({ ok: false, message: "Invalid identity presented" });
    }

    return user.id;
  } catch (err) {
    return res
      .status(401)
      .send({ ok: false, message: "Expired identity presented" });
  }
}
