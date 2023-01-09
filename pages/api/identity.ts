import { IdpUser, OAuthToken } from "../../@types/Profile";
import { NextApiRequest, NextApiResponse } from "next";
import jwt_decode from "jwt-decode";
import prisma from "../../lib/prisma";
import * as jwt from "jsonwebtoken";
import { ProfileTransformer } from "../../lib/profileTransformer";
import { JWTPayload } from "../../@types/Token";
import { generateAccessToken, generateRefreshToken } from "../../lib/auth";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    handleIdentityToken(req, res);
  }
  if (req.method === "GET") {
    handleTokenRefresh(req, res);
  }
}

/**
 * Public method for handling the OAuth Token returned from Google
 */
async function handleIdentityToken(req: NextApiRequest, res: NextApiResponse) {
  const { OAuthToken } = req.body;

  if (!OAuthToken) {
    res.status(500).send("No identity presented");
  }

  let decoded: OAuthToken;
  try {
    decoded = jwt_decode(OAuthToken);
    const user = await validateUserIdentity(res, decoded);

    const tokens = await generateTokens(user);

    if (!tokens.ok) {
      res
        .status(500)
        .send(
          "Something went estabishing a connection to the server. Please try again later."
        );
    }
    res.setHeader(
      "set-cookie",
      "jid=" + tokens.accessToken + "; path=/; HttpOnly"
    );
    const transformedUser = ProfileTransformer.transformTokenToIdpUser(
      user,
      tokens.accessToken
    );
    res.status(200).json(transformedUser);
  } catch (error) {
    res
      .status(403)
      .send("Invalid identity presented. This attempt has been logged.");
  }
}

/**
 * Public method for validating the users identity based on the decoded token
 * It either registers or logs in the user
 */
async function validateUserIdentity(res: NextApiResponse, decoded: OAuthToken) {
  let user: IdpUser;

  const userExists = await checkIfUserExists(decoded);

  if (!userExists) {
    user = await registerUser(decoded);
  }

  user = await loginUser(decoded);

  if (!user) {
    res
      .status(500)
      .send(
        "Something went wrong validating your identity. Please try again later."
      );
  }
  return user;
}

async function checkIfUserExists(decoded: OAuthToken) {
  const user = await prisma.user.findUnique({
    where: {
      providerId: decoded.sub,
    },
  });
  if (!user) {
    return false;
  }
  return true;
}

/**
 *  Public method for registering user based on the decoded token
 */
async function registerUser(profile: OAuthToken) {
  return await prisma.user.create({
    data: {
      email: profile.email,
      email_verified: true,
      name: profile.name,
      providerId: profile.sub,
      iss: profile.iss,
      picture: profile.picture,
      family_name: profile.family_name,
      given_name: profile.given_name,
    },
  });
}

/**
 * Public method for logging in user based on the decoded token
 */
async function loginUser(profile: OAuthToken) {
  return await prisma.user.findUnique({
    where: {
      providerId: profile.sub,
    },
  });
}
async function generateTokens(profile: IdpUser) {
  return {
    ok: true,
    accessToken: generateAccessToken(profile),
    refreshToken: generateRefreshToken(profile),
  };
}

async function handleTokenRefresh(req: NextApiRequest, res: NextApiResponse) {
  const { jid } = req.cookies;
  if (!jid) {
    return res.status(200).send({ ok: false, accessToken: "" });
  }
  console.log(jid);
  let payload: any = null;
  try {
    payload = jwt.verify(jid, process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    return res.status(200).send({ ok: false, accessToken: "" });
  }

  const user = await prisma.user.findUnique({
    where: {
      providerId: payload.providerId,
    },
  });
  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }
  // Prevent session manipulation
  if (user.tokenVersion !== payload.tokenVersion)
    return res.send({ ok: false, accessToken: "" });
  const tokens = await generateTokens(user);
  return res.status(200).json({ token: tokens.accessToken });
}
