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

export async function handleGoogleLogin(credential: CredentialResponse) {
  const res = await baseClient.post<User>("/api/identity", {
    token: credential.credential,
  });
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
  const res = await baseClient.post(`/api/comments/${comment.contentfulId}`, {
    message: comment.message,
    emailNotify: comment.emailNotify,
  });
  return res.data;
}

export async function replyToComment(
  comment: NewComment
): Promise<CommentSuccess> {
  const res = await baseClient.put(
    `/api/comments/${comment.contentfulId}/${comment.commentId}`,
    {
      message: comment.message,
    }
  );
  return res.data;
}

export async function updateComment(
  comment: NewComment
): Promise<CommentSuccess> {
  const res = await baseClient.patch(`/api/comments/${comment.commentId}`, {
    message: comment.message,
  });
  return res.data;
}

export async function deleteCommentFromRecord(
  commentId: string
): Promise<CommentSuccess> {
  const res = await baseClient.delete(`/api/comments/${commentId}`);
  return res.data;
}
