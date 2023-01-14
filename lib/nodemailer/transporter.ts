import nodeMailer from "nodemailer";

export default function emailSender() {
  return nodeMailer.createTransport({
    host: process.env.SMPT_ADDRESS,
    port: parseInt(process.env.SMPT_PORT),
    secure: true,
    auth: {
      user: process.env.SMPT_USERNAME,
      pass: process.env.SMPT_PASSWORD,
    },
  });
}
