import { NextApiRequest, NextApiResponse } from "next";
import { updateRecordViewCount } from "../../services/records.service";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST" && req.query.contentfulId) {
    return updateRecordViewCount(req, res);
  } else {
    return res.status(405).send("Method not allowed");
  }
}
