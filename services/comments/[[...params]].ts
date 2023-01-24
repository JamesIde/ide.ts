import type { NextApiResponse, NextApiRequest } from "next";
import {
  Post,
  Req,
  Res,
  Param,
  Body,
  Put,
  Patch,
  Delete,
  createHandler,
} from "next-api-decorators";
import { autoInjectable } from "tsyringe";
import { NewComment } from "./comment.dto";
import { CommentService } from "./comments.service";

@autoInjectable()
export class CommentHandler {
  constructor(private commentService: CommentService) {}

  @Post("/:contentfulId")
  public async createComment(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Param("contentfulId") contentfulId: string,
    @Body() newComment: NewComment
  ) {
    return await this.commentService.createComment(
      req,
      res,
      newComment,
      contentfulId
    );
  }

  @Put("/:contentfulId/:commentId")
  public async replyToComment(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Param("contentfulId") contentfulId: string,
    @Param("commentId") commentId: string,
    @Body() newComment: NewComment
  ) {
    return await this.commentService.replyToComment(
      req,
      res,
      contentfulId,
      commentId,
      newComment
    );
  }

  @Delete("/:commentId")
  public async deleteComment(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Param("commentId") commentId: string
  ) {
    return await this.commentService.deleteComment(req, res, commentId);
  }
}

export default createHandler(CommentHandler);
