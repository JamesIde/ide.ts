import { NextApiRequest, NextApiResponse } from "next";
import { EmailAdminPayload } from "../../@types/Email";
import prisma from "../../config/prisma";
import wash from "washyourmouthoutwithsoap";
import emojiStrip from "emoji-strip";
import {
  sendNewCommentEmailToAdmin,
  sendDeleteEmailToAdmin,
  sendCommentReplyEmail,
} from "../../lib/nodemailer/email";
import { ReplyCommentPayload } from "../../@types/Comment";
import { validateToken } from "../../lib/jwt/auth";

export const config = {
  runtime: "edge",
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST" && req.query.contentfulId) {
    createComment(req, res);
  } else if (
    req.method === "PUT" &&
    req.query.contentfulId &&
    req.query.commentId
  ) {
    replyToComment(req, res);
  } else if (req.method === "PATCH" && req.query.commentId) {
    updateComment(req, res);
  } else if (req.method === "DELETE" && req.query.commentId) {
    deleteComment(req, res);
  } else {
    res.status(405).send("Method not allowed");
  }
}

// Nodemailer config

/**
 * A public function to create a comment for a record.
 */
export async function createComment(req: NextApiRequest, res: NextApiResponse) {
  const user = await validateToken(req, res);
  const contentfulId = req.query.contentfulId as string;
  if (!contentfulId) {
    return res.status(400).send("No contentfulId provided");
  }

  if (!user) {
    return res
      .status(400)
      .send("Error occured validating your identity. Please try again later");
  }

  // Check how many comments the user has made for this record, but don't include the ADMIN user
  const commentCount = await prisma.comment.count({
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

  // If the user has reached the maximum comments per record, return an error

  if (commentCount >= 10) {
    return res
      .status(400)
      .send("You have reached the maximum comments per record");
  }

  const { message, emailNotify } = req.body;

  if (!message) {
    return res.status(400).send("No message provided");
  }

  // Returns true if the message contains profanity
  if (wash.check("en", message)) {
    return res
      .status(400)
      .send("Your comment contains profanity. Please remove it and try again.");
  }

  const cleanedMessage = emojiStrip(message);

  try {
    const comment = await prisma.comment.create({
      data: {
        message: cleanedMessage,
        emailNotify: emailNotify,
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

    await sendNewCommentEmailToAdmin(notifyAdminPayload);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res
      .status(400)
      .send("An error occured processing your comment. Please try again later");
  }
}
/**
 * A public function to reply to a comment
 */
export async function replyToComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await validateToken(req, res);
  const contentfulId = req.query.contentfulId as string;
  const commentId = req.query.commentId as string;

  if (!contentfulId) {
    res.status(400).send("No contentfulId provided");
  }

  if (!user) {
    return res
      .status(400)
      .send("Error occured validating your identity. Please try again later");
  }

  if (!commentId) {
    res.status(400).send("No commentId provided");
  }

  const { message } = req.body;

  if (!message) {
    res.status(400).send("No message provided");
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
    res.status(400).send("Comment not found");
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
        replyCommentUser: comment.user?.name,
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

      await sendCommentReplyEmail(replyToCommentPayload);
    }

    res.status(200).json(comment);
  } catch (error) {
    error;
    res
      .status(400)
      .send("An error occured processing your comment. Please try again later");
  }
}

/**
 * A public function to update a comment
 */
export async function updateComment(req: NextApiRequest, res: NextApiResponse) {
  const user = await validateToken(req, res);

  const commentId = req.query.commentId as string;

  if (!user) {
    return res
      .status(400)
      .send("Error occured validating your identity. Please try again later");
  }

  if (!commentId) {
    res.status(400).send("No commentId provided");
  }

  const { message } = req.body;

  if (!message) {
    res.status(400).send("No message provided");
  }

  // Check if the user created the comment first
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!comment) {
    res.status(400).send("No comment found");
  }

  if (comment.user.id !== user) {
    res.status(400).send("You are not the owner of this comment");
  }

  try {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        message: message,
      },
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    res
      .status(400)
      .send("An error occured processing your comment. Please try again later");
  }
}

/**
 * A public function to delete a comment
 */
export async function deleteComment(req: NextApiRequest, res: NextApiResponse) {
  const user = await validateToken(req, res);

  const commentId = req.query.commentId as string;

  if (!user) {
    return res
      .status(400)
      .send("Error occured validating your identity. Please try again later");
  }

  if (!commentId) {
    res.status(400).send("No commentId provided");
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
    res.status(400).send("No comment found");
  }

  if (comment.user.id !== user) {
    res.status(400).send("You are not the owner of this comment");
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

  await sendDeleteEmailToAdmin(deleteEmailPayload);
  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send("An error occured processing your comment. Please try again later");
  }
}
