import { NextApiRequest, NextApiResponse } from "next";
import { IdpUser, OAuthToken } from "../@types/Profile";
import { ProfileTransformer } from "../lib/transformer/profileTransformer";
import { v4 as uuidv4 } from "uuid";
import { sendNewUserEmailToAdmin } from "../lib/nodemailer/email";
import prisma from "../config/prisma";
import { deleteSession, setSession } from "../lib/redis/sessionHandlers";
import jwt_decode from "jwt-decode";
/**
 * Public method for handling the OAuth Token returned from Google
 */
export async function handleIdentityToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body.token) {
    return res.status(400).send("No identity presented");
  }
  const token = req.body.token;

  let decoded: OAuthToken;
  try {
    decoded = jwt_decode(token);
  } catch (error) {
    return res.status(400).send("Error establishing identity.");
  }

  const user = await validateUserIdentity(res, decoded);

  req.session.user = {
    sessionId: uuidv4(),
    userId: user.id,
  };

  const [setRedis, setSessionCookie] = await Promise.allSettled([
    await setSession(req.session.user.sessionId, req.session.user.userId, 1),
    await req.session.save(),
  ]);

  if (
    setRedis.status === "rejected" ||
    setSessionCookie.status === "rejected"
  ) {
    return res
      .status(500)
      .send("Something went wrong. Please try again later.");
  } else {
    return res.status(200).json(ProfileTransformer.transformProfile(user));
  }
}

/**
 * Public method for validating the users identity based on the decoded token
 * It either registers or logs in the user
 */
export async function validateUserIdentity(
  res: NextApiResponse,
  decoded: OAuthToken
): Promise<IdpUser> {
  let user: IdpUser;

  const userExists = await checkIfUserExists(decoded);

  if (!userExists) {
    user = await registerUser(decoded);
    await sendNewUserEmailToAdmin(user);
  }

  user = await loginUser(decoded);

  return user;
}

/**
 * A public method for checking if the user exists based on the decoded token
 */
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

/**
 * Public method for logging out a user and removing the session from Redis
 */
export async function handleSessionLogout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sessionId } = req.session.user;

  const [deleteSessionRedis, deleteSessionCookie] = await Promise.allSettled([
    await deleteSession(sessionId),
    req.session.destroy(),
  ]);

  if (
    deleteSessionRedis.status === "rejected" ||
    deleteSessionCookie.status === "rejected"
  ) {
    return res
      .status(500)
      .send("Something went wrong. Please try again later.");
  }
  return res.status(200).json({ ok: true });
}
