import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";
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
/**
 * A public function to create a comment for a record.
 */
export async function createComment(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers.user as string;
  const contentfulId = req.query.contentfulId as string;
  if (!contentfulId) {
    return res.status(400).send("No contentfulId provided");
  }

  if (!user) {
    return res.status(400).send("No user provided");
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).send("No message provided");
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
    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
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

/**
 * A public function to update a comment
 */
export async function updateComment(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers.user as string;
  const commentId = req.query.commentId as string;

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
    console.log(error);
    res
      .status(400)
      .send("An error occured processing your comment. Please try again later");
  }
}

/**
 * A public function to delete a comment
 */
export async function deleteComment(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers.user as string;
  const commentId = req.query.commentId as string;

  if (!user) {
    res.status(400).send("No user provided");
  }

  if (!commentId) {
    res.status(400).send("No commentId provided");
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
