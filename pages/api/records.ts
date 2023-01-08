import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    retrieveAllRecords(req, res);
  }
}

export async function retrieveAllRecords(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const records = await prisma.record.findMany();
  res.status(200).json(records);
}
