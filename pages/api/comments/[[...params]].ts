import { NextApiRequest, NextApiResponse } from "next";
import {
  createHandler,
  Get,
  Post,
  Param,
  Req,
  Res,
  Body,
  Put,
  Patch,
  Delete,
} from "next-api-decorators";
import {
  createComment,
  deleteComment,
  replyToComment,
  updateComment,
} from "./comments.service";
import { NewComment } from "./comment.dto";

export class CommentHandler {
  @Post("/:contentfulId")
  public createComment(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Param("contentfulId") contentfulId: string,
    @Body() newComment: NewComment
  ) {
    return createComment(req, res, newComment, contentfulId);
  }

  @Put("/:contentfulId/:commentId")
  public replyToComment(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Param("contentfulId") contentfulId: string,
    @Param("commentId") commentId: string,
    @Body() newComment: NewComment
  ) {
    return replyToComment(req, res, contentfulId, commentId, newComment);
  }

  @Patch("/:commentId")
  public updateComment(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Param("commentId") commentId: string,
    @Body() updateCommentPayload: NewComment
  ) {
    return updateComment(req, res, commentId, updateCommentPayload);
  }

  @Delete("/:commentId")
  public deleteComment(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Param("commentId") commentId: string
  ) {
    return deleteComment(req, res, commentId);
  }
}

export default createHandler(CommentHandler);
