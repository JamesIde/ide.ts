import { IdpUser, User } from "../../@types/Profile";

export class ProfileTransformer {
  /**
   * A public method to transform the user from the database to strip any information we don't want sent to the client.
   * It also injects the access token into the payload
   * @param idpUser
   * @param accessToken
   * @returns
   */
  public static transformProfile(idpUser: IdpUser): User {
    return {
      id: idpUser.id,
      email: idpUser.email,
      name: idpUser.name,
      picture: idpUser.picture,
    };
  }
}
