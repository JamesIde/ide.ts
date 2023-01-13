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
  contentfulId: string;
  message: string;
  commentId?: string;
}
