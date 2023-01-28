import { ReplyCommentPayload } from "../@types/Comment";
import { EmailAdminPayload, EMAIL_TYPES } from "../@types/Email";
import { IdpUser } from "../@types/Profile";
import broker from "../lib/broker/qStashClient";
import emailSender from "../lib/nodemailer/transporter";

export async function sendNewCommentEmailToAdmin(email: EmailAdminPayload) {
  await broker.publishJSON({
    topic: "email",
    body: {
      EMAIL_TYPE: EMAIL_TYPES.NEW_COMMENT,
      from: process.env.SMPT_USERNAME,
      to: process.env.ADMIN_EMAIL,
      subject: `Comment added to ${email.recordTitle}`,
      html: `<p>Comment added to ${email.recordTitle}. See below <br/>
    ${email.commentUser} posted: <strong>${email.commentMessage}</strong> on ${email.commentUserDate}</p>`,
    },
  });
}

export async function sendDeleteEmailToAdmin(email: EmailAdminPayload) {
  await broker.publishJSON({
    topic: "email",
    body: {
      EMAIL_TYPE: EMAIL_TYPES.DELETE_COMMENT,
      from: process.env.SMPT_USERNAME,
      to: process.env.ADMIN_EMAIL,
      subject: `Comment deleted from ${email.recordTitle}`,
      html: `<p>Comment deleted from ${email.recordTitle}. See below <br/>
    ${email.commentUser} deleted: <strong>${email.commentMessage}</strong> on ${email.commentUserDate}</p>`,
    },
  });
}

export async function sendNewUserEmailToAdmin(user: IdpUser) {
  await broker.publishJSON({
    topic: "email",
    body: {
      EMAIL_TYPE: EMAIL_TYPES.NEW_USER,
      from: process.env.SMPT_USERNAME,
      to: process.env.ADMIN_EMAIL,
      subject: `New registration ${user.email}`,
      html: `<p>New user created. See below <br/>
    ${user.name} registered with email: <strong>${
        user.email
      }</strong> on ${new Date(Date.now()).toString()}</p>`,
    },
  });
}

export async function sendCommentReplyEmail(payload: ReplyCommentPayload) {
  await broker.publishJSON({
    topic: "email",
    body: {
      EMAIL_TYPE: EMAIL_TYPES.COMMENT_REPLY,
      from: process.env.SMPT_USERNAME,
      to: payload.replyCommentUser,
      subject: `Reply to your comment on ${payload.recordTitle}`,
      html: `<p>Reply to your comment on ${payload.recordTitle}. See below <br/>
    ${payload.replyCommentUser} replied: <strong>${
        payload.replyCommentMessage
      }</strong> on ${new Date(Date.now()).toString()}</p>
    <br/>
    <p>
      View it
      <a href="https://jamesaide.com/records/${payload.recordSlug}">here</a>
    </p>
    `,
    },
  });
}
