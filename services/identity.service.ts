import { NextApiRequest, NextApiResponse } from "next";
import { IdpUser } from "../@types/Profile";
import { ProfileTransformer } from "../lib/transformer/profileTransformer";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";
import { deleteSession, setSession } from "../lib/redis/sessionHandlers";
import {
  GoogleOAuthTokenSuccess,
  GoogleProfile,
  GoogleToken,
} from "../@types/Token";
import fetch, { Response } from "node-fetch";
import broker from "../lib/broker/qStashClient";
import { sendNewUserEmailToAdmin } from "./email.service";
import * as Sentry from "@sentry/nextjs";
/**
 * Public method for handling the OAuth Token returned from Google
 */
export async function handleIdentityToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const clientOauthRequest: GoogleToken = req.body;
  if (!req.body) {
    return res.status(400).send("No identity presented");
  }

  const googleToken = await handleGoogleTokenValidation(clientOauthRequest);
  Sentry.captureMessage("Google token validated", {
    tags: {
      code: clientOauthRequest.code,
    },
  });
  if (!googleToken) {
    return res.status(500).send("Error establishing identity.");
  }

  const googleProfile = await handleGoogleUserInformation(
    googleToken.access_token
  );

  Sentry.captureMessage("Google profile retrieved", {
    tags: {
      code: clientOauthRequest.code,
    },
  });

  if (!googleProfile) {
    return res.status(500).send("Error establishing identity.");
  }

  const user = await validateUserIdentity(googleProfile);
  Sentry.captureMessage("User validated", {
    tags: {
      code: clientOauthRequest.code,
    },
  });

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
    Sentry.captureMessage("Session set", {
      tags: {
        user: user.email,
      },
    });

    return res.status(200).json(ProfileTransformer.transformProfile(user));
  }
}

/**
 * A private method for calling Google's OAuth token API to validate the client code
 * This is called after a user hits 'Sign in with Google' on the UI.
 */
export async function handleGoogleTokenValidation(
  clientOauthRequest: GoogleToken
): Promise<GoogleOAuthTokenSuccess> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    code: clientOauthRequest.code,
    grant_type: "authorization_code",
    redirect_uri:
      process.env.NODE_ENV === "production"
        ? process.env.OAUTH_PROD_URL
        : process.env.OAUTH_DEV_URL,
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const url = new URL(process.env.GOOGLE_OAUTH_TOKEN_URL);

  let response: Response;
  try {
    response = await fetch(url.href.toString(), requestOptions);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        code: clientOauthRequest.code,
        clientId,
      },
    });
    throw new Error("Error establishing identity on your behalf.");
  }

  if (response.ok) {
    const data = await response.json();
    return data as GoogleOAuthTokenSuccess;
  } else {
    let message: string;
    try {
      message = (await response.json()) as string;
    } catch (error) {}

    Sentry.captureException(
      message ?? `Error ${response.status}: ${response.statusText}`,
      {
        tags: {
          code: clientOauthRequest.code,
          clientId,
          clientSecret,
        },
      }
    );

    throw new Error(
      message ?? `Error ${response.status}: ${response.statusText}`
    );
  }
}

/**
 * A private method for accessing Googles profile API with the access token obtained from Googles OAuth token API.
 * This returns the user's Google profile information.
 */
export async function handleGoogleUserInformation(token: string) {
  const url = new URL(process.env.GOOGLE_OAUTH_PROFILE_URL);

  const requestOptions = {
    method: "GET",
    "Content-Type": "application/json",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  let response: Response;
  try {
    response = await fetch(url.href.toString(), requestOptions);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        token,
      },
    });

    throw new Error("Error establishing identity on your behalf.");
  }

  if (response.ok) {
    const data = await response.json();
    return data as GoogleProfile;
  } else {
    let message: string;
    try {
      message = (await response.json()) as string;
    } catch (error) {}

    Sentry.captureException(
      message ?? `Error ${response.status}: ${response.statusText}`,
      {
        tags: {
          token,
        },
      }
    );

    throw new Error(
      message ?? `Error ${response.status}: ${response.statusText}`
    );
  }
}

/**
 * Public method for validating the user identity based on the google profile obtained from google.
 * The profile is handed to this function after the OAuth steps have completed.
 * A check for registering or logging in the user is performed.
 */
export async function validateUserIdentity(
  user: GoogleProfile
): Promise<IdpUser> {
  let userProfile;

  const userExists = await checkIfUserExists(user);

  if (!userExists) {
    userProfile = await registerUser(user);
    sendNewUserEmailToAdmin(userProfile);
  } else {
    userProfile = await loginUser(user);
  }
  return userProfile;
}

/**
 * A public method for checking if the user exists based on the google profile Id (provider Id)
 */
export async function checkIfUserExists(user: GoogleProfile) {
  const existingUser = await prisma.user.findUnique({
    where: {
      providerId: user.id,
    },
  });
  if (!existingUser) {
    return false;
  }
  return true;
}

/**
 *  Public method for registering users
 */
export async function registerUser(user: GoogleProfile) {
  return await prisma.user.create({
    data: {
      email: user.email,
      email_verified: true,
      name: user.name,
      providerId: user.id,
      iss: "https://accounts.google.com",
      picture: user.picture,
      family_name: user.family_name,
      given_name: user.given_name,
    },
  });
}

/**
 * Public method for logging in users
 */
export async function loginUser(user: GoogleProfile) {
  return await prisma.user.findUnique({
    where: {
      providerId: user.id,
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
