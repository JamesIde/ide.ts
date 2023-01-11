import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST" && req.query.contentfulId) {
    createComment(req, res);
  }
  if (req.method === "PUT" && req.query.contentfulId && req.query.commentId) {
    replyToComment(req, res);
  }
}
/**
 * A public function to create a comment for a record.
 */
export async function createComment(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers.user as string;
  const contentfulId = req.query.contentfulId as string;
  if (!contentfulId) {
    res.status(400).send("No contentfulId provided");
  }

  if (!user) {
    res.status(400).send("No user provided");
  }

  const { message } = req.body;
  if (!message) {
    res.status(400).send("No message provided");
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        message: message,
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
    });
    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res
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
  const user = req.headers.user as string;
  const contentfulId = req.query.contentfulId as string;
  const commentId = req.query.commentId as string;

  if (!contentfulId) {
    res.status(400).send("No contentfulId provided");
  }

  if (!user) {
    res.status(400).send("No user provided");
  }

  if (!commentId) {
    res.status(400).send("No commentId provided");
  }

  const { message } = req.body;

  if (!message) {
    res.status(400).send("No message provided");
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
    });
    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send("An error occured processing your comment. Please try again later");
  }
}
