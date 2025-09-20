import prisma from "../config/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * A public method to update the view count for a record
 */
export async function updateRecordViewCount(req: NextApiRequest, res: NextApiResponse) {
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

    return res.status(200).json({
      viewCount: updatedRecord.viewCount,
    });
  } catch (error) {
    return res.status(400).json({
      message: `Error updating view count for record: ${contentfulId}`,
    });
  }
}
