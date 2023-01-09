import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST" && req.query.contentfulId) {
    createComment(req, res);
  }
}

export async function createComment(req: NextApiRequest, res: NextApiResponse) {
  const user = req.headers.user as string;
  const contentfulId = req.query.contentfulId as string;
  res.status(200).send("haha ok");
  // if (!contentfulId) {
  //   res.status(400).send("No contentfulId provided");
  // }
  // const { message, parentId } = req.body;
  // try {
  //   const comment = await prisma.comment.create({
  //     data: {
  //       message,
  //       recordId: contentfulId,
  //       userId: user,
  //     },
  //   });
  //   res.status(200).json(comment);
  // } catch (error) {
  //   console.log(error);
  //   res
  //     .status(400)
  //     .send("An error occured processing your comment. Please try again later");
  // }
}
