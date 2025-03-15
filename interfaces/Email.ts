export interface EmailAdminPayload {
  recordTitle: string;
  recordId: string;
  commentId: string;
  commentMessage: string;
  commentUser: string;
  commentUserId: string;
  commentUserEmail: string;
  commentUserDate: string;
}

export enum EMAIL_TYPES {
  NEW_COMMENT = "NEW_COMMENT",
  DELETE_COMMENT = "DELETE_COMMENT",
  NEW_USER = "NEW_USER",
  COMMENT_REPLY = "COMMENT_REPLY",
}
