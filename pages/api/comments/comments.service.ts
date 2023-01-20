import { NextApiRequest, NextApiResponse } from "next";
import { EmailAdminPayload } from "../../../@types/Email";
import prisma from "../../../config/prisma";
import wash from "washyourmouthoutwithsoap";
import emojiStrip from "emoji-strip";
import {
  sendNewCommentEmailToAdmin,
  sendDeleteEmailToAdmin,
  sendCommentReplyEmail,
} from "../../../lib/nodemailer/email";
import { ReplyCommentPayload } from "../../../@types/Comment";
import { validateToken } from "../../../lib/jwt/auth";
import {
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from "next-api-decorators";
import { NewComment } from "./comment.dto";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class CommentService {
  /**
   * A public function to create a comment for a record.
   */
  public async createComment(
    req: NextApiRequest,
    res: NextApiResponse,
    newComment: NewComment,
    contentfulId: string
  ) {
    const user = await validateToken(req, res);

    if (user) {
      if (!contentfulId) {
        throw new BadRequestException("No contentfulId provided");
      }

      // Check how many comments the user has made for this record, but don't include the ADMIN user
      const commentCount = await prisma.comment.count({
        where: {
          AND: [
            {
              record: {
                id: contentfulId,
              },
            },
            {
              user: {
                id: user,
              },
            },
            {
              user: {
                id: {
                  not: process.env.ADMIN_ID,
                },
              },
            },
          ],
        },
      });

      // If the user has reached the maximum comments per record, return an error

      if (commentCount >= 10) {
        throw new BadRequestException(
          "You have reached the maximum comments per record"
        );
      }

      if (!newComment.message) {
        throw new BadRequestException("No message provided");
      }

      // Returns true if the message contains profanity
      if (wash.check("en", newComment.message)) {
        throw new BadRequestException(
          "Your comment contains profanity. Please remove it and try again."
        );
      }

      const cleanedMessage = emojiStrip(newComment.message);

      try {
        const comment = await prisma.comment.create({
          data: {
            message: cleanedMessage,
            emailNotify: newComment.emailNotify,
            record: {
              connect: {
                id: contentfulId,
              },
            },
            user: {
              connect: {
                id: user,
              },
            },
          },
          include: {
            user: true,
            record: true,
          },
        });

        const notifyAdminPayload: EmailAdminPayload = {
          recordTitle: comment.record?.title,
          recordId: comment.record?.id,
          commentId: comment.id,
          commentMessage: cleanedMessage,
          commentUser: comment.user?.name,
          commentUserId: comment.user?.id,
          commentUserEmail: comment.user?.email,
          commentUserDate: new Date(comment.createdAt).toLocaleDateString(
            "en-AU",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        };

        await sendNewCommentEmailToAdmin(notifyAdminPayload);
        return { ok: true };
      } catch (error) {
        throw new BadRequestException(
          "An error occured processing your comment. Please try again later"
        );
      }
    }
  }
  /**
   * A public function to reply to a comment
   */
  public async replyToComment(
    req: NextApiRequest,
    res: NextApiResponse,
    contentfulId: string,
    commentId: string,
    replyCommentPayload: NewComment
  ) {
    const user = await validateToken(req, res);

    if (user) {
      if (!contentfulId) {
        throw new BadRequestException("No contentfulId provided");
      }

      if (!commentId) {
        throw new BadRequestException("No commentId provided");
      }

      const message = replyCommentPayload.message;

      if (!message) {
        throw new BadRequestException("No message provided");
      }

      // Find the comment to check if it exists and has email notifications enabled
      const commentToReplyTo = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
        include: {
          user: true,
          record: true,
        },
      });

      if (!commentToReplyTo) {
        throw new BadRequestException("Comment not found");
      }

      try {
        const comment = await prisma.comment.create({
          data: {
            message: message,
            user: {
              connect: {
                id: user,
              },
            },
            record: {
              connect: {
                id: contentfulId,
              },
            },
            parent: {
              connect: {
                id: commentId,
              },
            },
          },
          include: {
            user: true,
          },
        });

        if (commentToReplyTo.emailNotify) {
          const replyToCommentPayload: ReplyCommentPayload = {
            recordTitle: commentToReplyTo.record?.title,
            recordSlug: commentToReplyTo.record?.slug,
            rootCommentUser: commentToReplyTo.user?.name,
            replyCommentUser: comment.user?.email,
            replyCommentMessage: comment.message,
            replyCommentDate: new Date(comment.createdAt)
              .toLocaleDateString("en-AU", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
              })
              .toString(),
          };

          await sendCommentReplyEmail(replyToCommentPayload);
        }

        return comment;
      } catch (error) {
        error;
        throw new BadRequestException(
          "An error occured processing your comment. Please try again later"
        );
      }
    }
  }

  /**
   * A public function to delete a comment
   */
  public async deleteComment(
    req: NextApiRequest,
    res: NextApiResponse,
    commentId: string
  ) {
    const user = await validateToken(req, res);

    console.log;

    if (user) {
      if (!commentId) {
        throw new BadRequestException("No commentId provided");
      }

      // Check if the user created the comment first
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
        include: {
          user: true,
          record: true,
        },
      });

      if (!comment) {
        throw new BadRequestException("No comment found");
      }

      if (comment.user.id !== user) {
        throw new ForbiddenException("You are not the owner of this comment");
      }

      const deleteEmailPayload: EmailAdminPayload = {
        recordTitle: comment.record?.title,
        recordId: comment.record?.id,
        commentId: comment.id,
        commentMessage: comment.message,
        commentUser: comment.user?.name,
        commentUserId: comment.user?.id,
        commentUserEmail: comment.user?.email,
        commentUserDate: new Date(Date.now()).toString(),
      };

      await sendDeleteEmailToAdmin(deleteEmailPayload);
      try {
        await prisma.comment.delete({
          where: {
            id: commentId,
          },
        });
        return { ok: true };
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(
          "An error occured deleting comment"
        );
      }
    }
  }
}
