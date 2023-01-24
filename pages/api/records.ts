import { NextApiRequest, NextApiResponse } from "next";
import {
  retrieveRecordComments,
  updateRecordViewCount,
} from "../../services/records.service";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET" && req.query.contentfulId) {
    return retrieveRecordComments(req, res);
  } else if (req.method === "POST" && req.query.contentfulId) {
    return updateRecordViewCount(req, res);
  } else {
    return res.status(405).send("Method not allowed");
  }
}
