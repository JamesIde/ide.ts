import type { NextApiResponse, NextApiRequest } from "next";
import { createHandler, Get, Param, Req, Res } from "next-api-decorators";
import { retrieveRecordComments } from "./records.service";

class RecordHandler {
  @Get("/:contentfulId")
  public retrieveAllRecordComments(
    @Param("contentfulId") contentfulId: string
  ) {
    return retrieveRecordComments(contentfulId);
  }
}

export default createHandler(RecordHandler);
