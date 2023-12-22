import prisma from "../config/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NewComment, ReplyCommentPayload } from "../@types/Comment";
import { EmailAdminPayload } from "../@types/Email";
import {
  sendCommentReplyEmail,
  sendDeleteEmailToAdmin,
  sendNewCommentEmailToAdmin,
} from "./email.service";
import emojiStrip from "emoji-strip";
import wash from "washyourmouthoutwithsoap";
import getUserFromHeader from "../lib/transformer/userHeader";
import * as Sentry from "@sentry/nextjs";

export async function createComment(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromHeader(req);
  const newComment: NewComment = req.body;
  const contentfulId = req.query.contentfulId as string;

  if (!contentfulId) {
    return res.status(400).json({ message: "No contentfulId provided" });
  }
  let commentCount: number;
  try {
    // Check how many comments the user has made for this record, but don't include the ADMIN user
    commentCount = await prisma.comment.count({
      where: {
        AND: [
          {
            record: {
              id: contentfulId,
            },
          },
          {
            user: {
              id: user,
            },
          },
          {
            user: {
              id: {
                not: process.env.ADMIN_ID,
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    console.log(error);
    Sentry.captureException(error, {
      tags: {
        contentfulId: contentfulId,
        user: user,
      },
    });
    return res
      .status(500)
      .send("Error adding a comment. Please try again later.");
  }

  // If the user has reached the maximum comments per record, return an error

  if (commentCount >= 10) {
    return res.status(400).send("Maximum comments per record reached");
  }

  if (!newComment.message) {
    return res.status(400).send("No message provided");
  }

  // Returns true if the message contains profanity
  if (wash.check("en", newComment.message)) {
    return res
      .status(400)
      .send("Your comment contains profanity. Please remove it and try again.");
  }

  const cleanedMessage = emojiStrip(newComment.message);
  try {
    const comment = await prisma.comment.create({
      data: {
        message: cleanedMessage,
        emailNotify: newComment.emailNotify,
        record: {
          connect: {
            id: contentfulId,
          },
        },
        user: {
          connect: {
            id: user,
          },
        },
      },
      include: {
        user: true,
        record: true,
      },
    });

    const notifyAdminPayload: EmailAdminPayload = {
      recordTitle: comment.record?.title,
      recordId: comment.record?.id,
      commentId: comment.id,
      commentMessage: cleanedMessage,
      commentUser: comment.user?.name,
      commentUserId: comment.user?.id,
      commentUserEmail: comment.user?.email,
      commentUserDate: new Date(comment.createdAt).toLocaleDateString("en-AU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // sendNewCommentEmailToAdmin(notifyAdminPayload);
    return res.status(201).json({ ok: true });
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        contentfulId: contentfulId,
        user: user,
      },
    });
    return res
      .status(500)
      .send("Error occured adding comment. Try again later.");
  }
}

export async function replyToComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getUserFromHeader(req);
  const contentfulId = req.query.contentfulId as string;
  const commentId = req.query.commentId as string;
  const replyCommentPayload: NewComment = req.body;

  if (user) {
    if (!contentfulId) {
      return res.status(400).send("No contentfulId provided");
    }

    if (!commentId) {
      return res.status(400).send("No commentId provided");
    }

    const message = replyCommentPayload.message;

    if (!message) {
      return res.status(400).send("No message provided");
    }

    // Find the comment to check if it exists and has email notifications enabled
    const commentToReplyTo = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: true,
        record: true,
      },
    });

    if (!commentToReplyTo) {
      return res.status(400).send("No comment found");
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          message: message,
          user: {
            connect: {
              id: user,
            },
          },
          record: {
            connect: {
              id: contentfulId,
            },
          },
          parent: {
            connect: {
              id: commentId,
            },
          },
        },
        include: {
          user: true,
        },
      });

      if (commentToReplyTo.emailNotify) {
        const replyToCommentPayload: ReplyCommentPayload = {
          recordTitle: commentToReplyTo.record?.title,
          recordSlug: commentToReplyTo.record?.slug,
          rootCommentUser: commentToReplyTo.user?.name,
          replyCommentUser: comment.user?.email,
          replyCommentMessage: comment.message,
          replyCommentDate: new Date(comment.createdAt)
            .toLocaleDateString("en-AU", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
            })
            .toString(),
        };

        // sendCommentReplyEmail(replyToCommentPayload);
      }

      return res.status(201).json(comment);
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          contentfulId: contentfulId,
          user: user,
        },
      });
      return res
        .status(500)
        .send(
          "An error occured processing your comment. Please try again later"
        );
    }
  }
}

export async function deleteComment(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromHeader(req);
  const commentId = req.query.commentId as string;
  if (user) {
    if (!commentId) {
      return res.status(400).send("No commentId provided");
    }

    // Check if the user created the comment first
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: true,
        record: true,
      },
    });

    if (!comment) {
      return res.status(400).send("No comment found");
    }

    if (comment.user.id !== user) {
      return res
        .status(403)
        .send("No relationship between user and comment found");
    }

    const deleteEmailPayload: EmailAdminPayload = {
      recordTitle: comment.record?.title,
      recordId: comment.record?.id,
      commentId: comment.id,
      commentMessage: comment.message,
      commentUser: comment.user?.name,
      commentUserId: comment.user?.id,
      commentUserEmail: comment.user?.email,
      commentUserDate: new Date(Date.now()).toString(),
    };

    // sendDeleteEmailToAdmin(deleteEmailPayload);
    try {
      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
      return res.status(200).json({ ok: true });
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          commentId: commentId,
          user: user,
        },
      });
      return res
        .status(500)
        .send("Error deleting comment. Please try again later.");
    }
  }
}
