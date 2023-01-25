import { NextApiRequest } from "next";

function getUserFromHeader(req: NextApiRequest) {
  const user = req.headers["user"];
  return user as string;
}
export default getUserFromHeader;
