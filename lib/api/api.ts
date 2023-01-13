import { CredentialResponse } from "@react-oauth/google";
import { User } from "../../@types/Profile";
import {
  CommentRetrievalSuccess,
  CommentSuccess,
  CommentType,
  NewComment,
} from "../../@types/Comment";
import baseClient from "../../config/baseClient";
export async function handleGoogleLogin(credential: CredentialResponse) {
  const res = await baseClient.post<User>("/api/identity", {
    OAuthToken: credential.credential,
  });
  return res.data;
}

export async function retrieveAllRecordComments(contentfulId: string) {
  const res = await baseClient.get<CommentRetrievalSuccess>(
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

export async function replyToComment(
  comment: NewComment
): Promise<CommentSuccess> {
  const res = await baseClient.put(
    `/api/comments?contentfulId=${comment.contentfulId}&commentId=${comment.commentId}`,
    {
      message: comment.message,
    }
  );
  return res.data;
}

export async function deleteCommentFromRecord(
  commentId: string
): Promise<CommentSuccess> {
  const res = await baseClient.delete(`/api/comments?commentId=${commentId}`);
  return res.data;
}
