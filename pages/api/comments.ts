import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST" && req.query.contentfulId) {
    console.log("ihere");
    createComment(req, res);
  }
  if (req.method === "PUT" && req.query.contentfulId && req.query.commentId) {
    console.log("Asd");
    replyToComment(req, res);
  }
}

export async function createComment(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers.user as string;
  const contentfulId = req.query.contentfulId as string;
  if (!contentfulId) {
    res.status(400).send("No contentfulId provided");
  }
  const { message } = req.body;
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

export async function replyToComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = req.headers.user as string;
  const contentfulId = req.query.contentfulId as string;
  const commentId = req.query.commentId as string;
  console.log("commentId", commentId);
  // if (!user || !contentfulId || !commentId) {
  //   res.status(400).send("Invalid request");
  // }

  const { message } = req.body;

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
