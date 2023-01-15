import { Comment } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { BadRequestException } from "next-api-decorators";
import prisma from "../../config/prisma";
import createNestedStructure from "../../lib/transformer/nestedComment";
// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "GET" && req.query.contentfulId) {
//     retrieveRecordComments(req, res);
//   } else {
//     res.status(405).send("Method not allowed");
//   }
// }

/**
 * Public method to retrieve a single record and all its comments
 * We use the /api/records endpoint to fetch the comments without any authentication (unlike most routes in /api/comments)
 */
export async function retrieveRecordComments(recordId: string) {
  const contentfulId = recordId;
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const commentTree = createNestedStructure(rootComments);
    return {
      commentCount: rootComments.length,
      comments: commentTree,
    };
  } catch (error) {
    throw new BadRequestException(
      `Error retrieving comments for record: ${contentfulId}`
    );
  }
}
