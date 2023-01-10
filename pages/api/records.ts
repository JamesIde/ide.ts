import { Comment } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET" && req.query.contentfulId) {
    retrieveRecord(req, res);
  }
}

const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
      picture: true,
    },
  },
};
// Dummy function
export async function retrieveAllRecords(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const records = await prisma.record.findMany({
    include: {
      comments: true,
    },
  });
  res.status(200).json(records);
  res.end();
}

/**
 * Public method to retrieve a single record and all its comments
 */
export async function retrieveRecord(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const contentfulId = req.query.contentfulId as string;
  try {
    const rootComments = await prisma.comment.findMany({
      where: {
        record: {
          id: contentfulId,
        },
      },
    });

    const commentTree = createNestedStructure(rootComments);
    res.status(200).json(commentTree);
  } catch (error) {
    console.log("error is ", error);
    res
      .status(500)
      .send(`Error retrieving record with contentfulId: ${contentfulId}`);
  }
}

function createNestedStructure(comments, parentId = null) {
  let nestedComments = [];

  for (const comment of comments) {
    if (comment.parentId === parentId) {
      const children = createNestedStructure(comments, comment.id);
      if (children.length > 0) {
        comment.children = children;
      }
      nestedComments.push(comment);
    }
  }

  return nestedComments;
}
