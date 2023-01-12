import { CredentialResponse } from "@react-oauth/google";
import { User } from "../../@types/Profile";
import { CommentSuccess, CommentType, NewComment } from "../../@types/Comment";
import baseClient from "../../config/baseClient";
export async function handleGoogleLogin(credential: CredentialResponse) {
  const res = await baseClient.post<User>("/api/identity", {
    OAuthToken: credential.credential,
  });
  return res.data;
}

export async function retrieveAllRecordComments(contentfulId: string) {
  const res = await baseClient.get<CommentType[]>(
    `/api/records?contentfulId=${contentfulId}`
  );

  return res.data;
}

export async function addCommentToRecord(
  comment: NewComment
): Promise<CommentSuccess> {
  const res = await baseClient.post(
    `/api/comments?contentfulId=${comment.contentfulId}`,
    {
      message: comment.message,
    }
  );
  return res.data;
}
