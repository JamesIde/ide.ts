import { BadRequestException } from "next-api-decorators";
import { autoInjectable } from "tsyringe";
import prisma from "../../../config/prisma";
import createNestedStructure from "../../../lib/transformer/nestedComment";

/**
 * Public method to retrieve a single record and all its comments
 * We use the /api/records endpoint to fetch the comments without any authentication (unlike most routes in /api/comments)
 */

@autoInjectable()
export class RecordService {
  public async retrieveRecordComments(recordId: string) {
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
}
