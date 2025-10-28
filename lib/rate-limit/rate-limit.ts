import { NextApiRequest } from "next";
import { redisClient } from "./redis";
export async function limit(req: NextApiRequest) {
  const ip = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.socket.remoteAddress;

  if (!ip) return true;

  const contentfulId = req.query.contentfulId as string;

  var exists = await redisClient.get(ip + contentfulId);

  if (!exists) {
    await redisClient.set(ip + contentfulId, 1, {
      ex: 300, // 5 minutes in seconds
    });

    return false;
  }

  return true;
}
