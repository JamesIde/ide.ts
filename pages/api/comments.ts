import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../lib/iron-session/sessionOptions";
import {
  createComment,
  deleteComment,
  replyToComment,
} from "../../services/comments.service";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return createComment(req, res);
  } else if (req.method === "PUT") {
    return replyToComment(req, res);
  } else if (req.method === "DELETE") {
    return deleteComment(req, res);
  }
}

export default withSessionRoute(handler);
