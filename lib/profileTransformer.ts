import { IdpUser, User } from "../@types/Profile";

export class ProfileTransformer {
  public static transformTokenToIdpUser(
    idpUser: IdpUser,
    accessToken: string
  ): User {
    return {
      id: idpUser.id,
      email: idpUser.email,
      name: idpUser.name,
      email_verified: idpUser.email_verified,
      providerId: idpUser.providerId,
      picture: idpUser.picture,
      given_name: idpUser.given_name,
      family_name: idpUser.family_name,
      token: accessToken,
    };
  }
}
