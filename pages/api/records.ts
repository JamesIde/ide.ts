import { Comment } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../config/prisma";
import createNestedStructure from "../../lib/transformer/nestedComment";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET" && req.query.contentfulId) {
    retrieveRecordComments(req, res);
  } else {
    res.status(405).send("Method not allowed");
  }
}

/**
 * Public method to retrieve a single record and all its comments
 * We use the /api/records endpoint to fetch the comments without any authentication (unlike most routes in /api/comments)
 */
export async function retrieveRecordComments(
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
      include: {
        user: {
          select: {
            id: true,
            name: true,
            picture: true,
          },
        },
      },
    });

    const commentTree = createNestedStructure(rootComments);
    res
      .status(200)
      .json({ commentCount: rootComments.length, comments: commentTree });
  } catch (error) {
    console.log("error is ", error);
    res
      .status(500)
      .send(`Error retrieving comments for record: ${contentfulId}`);
  }
}
