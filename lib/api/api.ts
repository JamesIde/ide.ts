import { CredentialResponse } from "@react-oauth/google";
import { User } from "../../@types/Profile";
import {
  CommentRetrievalSuccess,
  CommentSuccess,
  CommentType,
  NewComment,
} from "../../@types/Comment";
import baseClient from "../../config/baseClient";
import { ViewCount } from "../../@types/ViewCount";
import { GoogleToken, LogoutSuccess } from "../../@types/Token";

export async function handleGoogleLogin(googleToken: GoogleToken) {
  const res = await baseClient.post<User>("/api/identity", {
    code: googleToken.code,
  });
  return res.data;
}

export async function handleSessionLogout() {
  const res = await baseClient.delete<LogoutSuccess>("/api/identity");
  return res.data;
}

export async function retrieveAllRecordComments(contentfulId: string) {
  const res = await baseClient.get<CommentRetrievalSuccess>(
    `/api/records?contentfulId=${contentfulId}`
  );
  return res.data;
}

export async function updateRecordViewCount(
  contentfulId: string
): Promise<ViewCount> {
  const res = await baseClient.post(
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
      emailNotify: comment.emailNotify,
    }
  );
  return res.data;
}

export async function replyToComment(
  comment: NewComment
): Promise<CommentSuccess> {
  const res = await baseClient.put(
    `/api/comments/?contentfulId=${comment.contentfulId}&commentId=${comment.commentId}`,
    {
      message: comment.message,
    }
  );
  return res.data;
}

export async function deleteCommentFromRecord(
  commentId: string
): Promise<CommentSuccess> {
  const res = await baseClient.delete(`/api/comments/?commentId=${commentId}`);
  return res.data;
}

export async function addEmailToAudienceList(email: string) {
  const res = baseClient.post("/api/mailchimp", { email });
  return res;
}
