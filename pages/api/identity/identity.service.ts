import { IdpUser, OAuthToken } from "../../../@types/Profile";
import { NextApiRequest, NextApiResponse } from "next";
import jwt_decode from "jwt-decode";
import prisma from "../../../config/prisma";
import * as jwt from "jsonwebtoken";
import { ProfileTransformer } from "../../../lib/transformer/profileTransformer";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../lib/jwt/auth";
import { sendNewUserEmailToAdmin } from "../../../lib/nodemailer/email";
import {
  BadRequestException,
  InternalServerErrorException,
  Req,
  Res,
} from "next-api-decorators";

/**
 * Public method for handling the OAuth Token returned from Google
 */
export async function handleIdentityToken(
  res: NextApiResponse,
  OAuthToken: string
) {
  if (!OAuthToken) {
    throw new BadRequestException("No identity presented");
  }

  let decoded: OAuthToken;
  try {
    decoded = jwt_decode(OAuthToken);
    const user = await validateUserIdentity(decoded);

    const tokens = await generateTokens(user);

    if (!tokens.ok) {
      throw new InternalServerErrorException(
        "Something went estabishing a connection to the server. Please try again later."
      );
    }
    res.setHeader(
      "set-cookie",
      "jid=" + tokens.refreshToken + "; path=/; HttpOnly"
    );
    const transformedUser = ProfileTransformer.transformProfile(
      user,
      tokens.accessToken
    );
    return transformedUser;
  } catch (error) {
    throw new BadRequestException(
      "Invalid identity presented. This attempt has been logged."
    );
  }
}

/**
 * Public method for validating the users identity based on the decoded token
 * It either registers or logs in the user
 */
export async function validateUserIdentity(decoded: OAuthToken) {
  let user: IdpUser;

  const userExists = await checkIfUserExists(decoded);

  if (!userExists) {
    user = await registerUser(decoded);
    await sendNewUserEmailToAdmin(user);
  }

  user = await loginUser(decoded);
  if (!user) {
    throw new InternalServerErrorException(
      "Something went wrong validating your identity. Please try again later."
    );
  }
  return user;
}

export async function checkIfUserExists(decoded: OAuthToken) {
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
export async function registerUser(profile: OAuthToken) {
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
export async function loginUser(profile: OAuthToken) {
  return await prisma.user.findUnique({
    where: {
      providerId: profile.sub,
    },
  });
}
export async function generateTokens(profile: IdpUser) {
  return {
    ok: true,
    accessToken: generateAccessToken(profile),
    refreshToken: generateRefreshToken(profile),
  };
}

export async function handleTokenRefresh(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { jid } = req.cookies;
  if (!jid) {
    return res.status(400).send({ ok: false, accessToken: "" });
  }
  let payload: any = null;
  try {
    payload = jwt.verify(jid, process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET);
  } catch (err) {
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
  return res.status(200).json({ ok: true, token: tokens.accessToken });
}
