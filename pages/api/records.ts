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
  console.log(contentfulId);
  try {
    const record = await prisma.record.findUnique({
      where: {
        contentfulId: contentfulId,
      },
      // include: {
      //   comments: {
      //     orderBy: {
      //       createdAt: "desc",
      //     },
      //     // select: {
      //     //   ...COMMENT_SELECT_FIELDS,
      //     // },
      //   },
      // },
    });
    console.log(record);
    res.status(200).json(record);
  } catch (error) {
    res
      .status(500)
      .send(`Error retrieving record with contentfulId: ${contentfulId}`);
  }
}
