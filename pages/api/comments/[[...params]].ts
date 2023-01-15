import { NextApiRequest, NextApiResponse } from "next";
import {
  createHandler,
  Get,
  Post,
  Param,
  Req,
  Res,
  Body,
} from "next-api-decorators";
import { createComment } from "./comments.service";
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
}

export default createHandler(CommentHandler);
