import { EmailAdminPayload } from "../../@types/Email";
import emailSender from "./transporter";

export default async function sendEmailToAdmin(email: EmailAdminPayload) {
  await emailSender().sendMail({
    from: process.env.SMPT_USERNAME,
    to: process.env.ADMIN_EMAIL,
    subject: `New comment added to ${email.recordTitle}`,
    html: `<p>New comment added to ${email.recordTitle}. See below <br/>
    ${email.commentUser} posted: <strong>${email.commentMessage}</strong> on ${email.commentUserDate}</p>`,
  });
}
