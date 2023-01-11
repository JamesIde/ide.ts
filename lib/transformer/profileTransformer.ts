import { IdpUser, User } from "../../@types/Profile";

export class ProfileTransformer {
  /**
   * A public method to transform the user from the database to strip any information we don't want sent to the client.
   * It also injects the access token into the payload
   * @param idpUser
   * @param accessToken
   * @returns
   */
  public static transformProfile(idpUser: IdpUser, accessToken: string): User {
    return {
      id: idpUser.id,
      email: idpUser.email,
      name: idpUser.name,
      email_verified: idpUser.email_verified,
      // providerId: idpUser.providerId,
      picture: idpUser.picture,
      given_name: idpUser.given_name,
      family_name: idpUser.family_name,
      token: accessToken,
    };
  }
}
