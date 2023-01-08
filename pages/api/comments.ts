import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST" && req.query.contentfulId) {
    createComment(req, res);
  }
}

export async function createComment(req: NextApiRequest, res: NextApiResponse) {
  // const contentfulId = req.query.contentfulId as string;
  // const { message, parentId } = req.body;
  // try {
  //     const comment = await prisma.comment.create({
  //         data: {
  //             message,
  //             parentId,
  //             recordId: contentfulId,
  //             userId: "1"
  //         }
  //     })
  //     res.status(200).json(comment)
  // } catch (error) {
  //     res.status(400).json({ error: error.message })
  // }

  console.log("received in create comment");
  console.log(req.headers.user);
}
