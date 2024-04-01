import { NextApiRequest, NextApiResponse } from "next";
import * as mailchimp from "@mailchimp/mailchimp_marketing";
import * as Sentry from "@sentry/nextjs";
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_ID,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
        email_address: email,
        status: "subscribed",
      });
      return res.status(201).end();
    } catch (error) {
      console.log(error);
      Sentry.captureException(error, { data: email });
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
}
