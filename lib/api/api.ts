import { CredentialResponse } from "@react-oauth/google";
import { User } from "../../@types/Profile";
import { CommentType } from "../../@types/Comment";
import baseClient from "../../config/baseClient";
export async function ProcessGoogleLogin(credential: CredentialResponse) {
  const res = await baseClient.post<User>("/api/identity", {
    OAuthToken: credential.credential,
  });
  return res.data;
}

export async function RetrieveRecordComments(contentfulId: string) {
  const res = await baseClient.get<CommentType[]>(
    `/api/records?contentfulId=${contentfulId}`
  );

  return res.data;
}
