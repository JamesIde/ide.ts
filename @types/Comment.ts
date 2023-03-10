import { User } from "./Profile";

export interface Child {
  id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  recordId: string;
  parentId: string;
  user: User;
  children: Child[];
}

export interface Record {
  id: string;
  title: string;
  slug: string;
}

export interface CommentType {
  id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  recordId: string;
  parentId?: any;
  user: User;
  children: Child[];
  record?: Record;
}

export interface CommentRetrievalSuccess {
  commentCount: number;
  comments: CommentType[];
}

export interface CommentSuccess {
  id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  recordId: string;
  parentId?: any;
}

export interface NewComment {
  contentfulId?: string;
  message: string;
  commentId?: string;
  emailNotify?: boolean;
}

export interface ReplyCommentPayload {
  recordTitle: string;
  recordSlug: string;
  rootCommentUser: string;
  replyCommentUser: string;
  replyCommentMessage: string;
  replyCommentDate: string;
}

// For nested comment
export interface Comment {
  id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  userId: string;
  emailNotify: boolean;
  record: Record;
  recordId: string;
  parent: Comment | null;
  children: Comment[];
  parentId: string | null;
}
