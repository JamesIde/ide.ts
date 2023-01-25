import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../lib/iron-session/sessionOptions";
import {
  handleIdentityToken,
  handleSessionLogout,
} from "../../services/identity.service";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST" && req.body.token) {
    return handleIdentityToken(req, res);
  } else if (req.method === "DELETE") {
    return handleSessionLogout(req, res);
  } else {
    return res.status(405).send("Method not allowed");
  }
}
export default withSessionRoute(handler);
