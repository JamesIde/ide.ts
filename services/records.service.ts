import prisma from "../config/prisma";
import createNestedStructure from "../lib/transformer/nestedComment";
import { Comment } from "../@types/Comment";
import { NextApiRequest, NextApiResponse } from "next";
import * as Sentry from "@sentry/nextjs";
/**
 * A public method to retrieve all comments for a record
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
      orderBy: {
        createdAt: "desc",
      },
    });
    Sentry.captureMessage(`Retrieved comments for record: ${contentfulId}`);
    const commentTree = createNestedStructure(rootComments as Comment[]);
    return res.status(200).json({
      commentCount: rootComments.length,
      comments: commentTree,
    });
  } catch (error) {
    console.log(`HERE`, error);
    Sentry.captureException(error, {
      tags: {
        contentfulId,
      },
    });
    return res.status(400).json({
      message: `Error retrieving comments for record: ${contentfulId}`,
    });
  }
}

/**
 * A public method to update the view count for a record
 */
export async function updateRecordViewCount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const contentfulId = req.query.contentfulId as string;
  try {
    const record = await prisma.record.findUnique({
      where: {
        id: contentfulId,
      },
    });

    const updatedRecord = await prisma.record.update({
      where: {
        id: contentfulId,
      },
      data: {
        viewCount: record.viewCount + 1,
      },
    });
    Sentry.captureMessage(`Adjusted view count for record: ${contentfulId}`);

    return res.status(200).json({
      viewCount: updatedRecord.viewCount,
    });
  } catch (error) {
    console.log(`HERE`, error);
    Sentry.captureException(error, {
      tags: {
        contentfulId,
      },
    });
    return res.status(400).json({
      message: `Error updating view count for record: ${contentfulId}`,
    });
  }
}
