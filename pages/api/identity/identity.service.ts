import { IdpUser, OAuthToken } from "../../../@types/Profile";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../config/prisma";
import * as jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
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
import { autoInjectable } from "tsyringe";
import * as jose from "jose";
@autoInjectable()
export class IdentityService {
  /**
   * Public method for handling the OAuth Token returned from Google
   */
  public async handleIdentityToken(res: NextApiResponse, OAuthToken: string) {
    if (!OAuthToken) {
      throw new BadRequestException("No identity presented");
    }

    let decoded: OAuthToken;
    try {
      decoded = jwt_decode(OAuthToken);
      const user = await this.validateUserIdentity(decoded);

      const tokens = await this.generateTokens(user);

      if (!tokens.ok) {
        throw new InternalServerErrorException(
          "Something went estabishing a connection to the server. Please try again later."
        );
      }

      res.setHeader(
        "set-cookie",
        "jid=" +
          tokens.refreshToken +
          "; path=/;" +
          "; SameSite=none" +
          "; Secure" +
          `; Max-Age=${60 * 60 * 24 * 7}`
      );
      const transformedUser = ProfileTransformer.transformProfile(
        user,
        await tokens.accessToken
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
  private async validateUserIdentity(decoded: OAuthToken) {
    let user: IdpUser;

    const userExists = await this.checkIfUserExists(decoded);

    if (!userExists) {
      user = await this.registerUser(decoded);
      await sendNewUserEmailToAdmin(user);
    }

    user = await this.loginUser(decoded);
    if (!user) {
      throw new InternalServerErrorException(
        "Something went wrong validating your identity. Please try again later."
      );
    }
    return user;
  }

  public async checkIfUserExists(decoded: OAuthToken) {
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
  public async registerUser(profile: OAuthToken) {
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
  public async loginUser(profile: OAuthToken) {
    return await prisma.user.findUnique({
      where: {
        providerId: profile.sub,
      },
    });
  }
  private async generateTokens(profile: IdpUser) {
    return {
      ok: true,
      accessToken: await generateAccessToken(profile),
      refreshToken: await generateRefreshToken(profile),
    };
  }

  public async handleTokenRefresh(req: NextApiRequest, res: NextApiResponse) {
    const { jid } = req.cookies;
    if (!jid) {
      throw new BadRequestException("An error occured. Please login again.");
    }

    const secret = new TextEncoder().encode(
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET
    );

    let payload: any = null;
    try {
      const resp = await jose.jwtVerify(jid, secret, {
        issuer: "jamesaide",
      });
      payload = resp.payload;
    } catch (err) {
      throw new BadRequestException("An error occured. Please login again.");
    }

    const user = await prisma.user.findUnique({
      where: {
        providerId: payload.providerId,
      },
    });
    if (!user) {
      throw new BadRequestException(
        "An error occured. No user found with presented identity"
      );
    }
    // Prevent session manipulation
    if (user.tokenVersion !== payload.tokenVersion)
      throw new BadRequestException(
        "An error occured. Validating your identity"
      );
    const tokens = await this.generateTokens(user);
    return { ok: true, token: tokens.accessToken };
  }
}
