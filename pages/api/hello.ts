// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let username = "James";

  if (req.method === "GET") {
    res.status(200).json({ message: `Hello ${username}` });
  } else if (req.method === "POST") {
    // username = req.body.name;
    res.status(200).json({ message: `Name Updated` });
  }
}

/**
 * const { method } = req
  switch (method) {
    case 'GET':
      try {
        const stars = await prisma.star.findMany()
        res.status(200).json(stars)
      } catch (e) {
        console.error('Request error', e)
        res.status(500).json({ error: 'Error fetching posts' })
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
 * 
 */
