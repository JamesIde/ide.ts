import { NextApiRequest, NextApiResponse } from "next";
import { createHandler, Get, Param, Req, Res } from "next-api-decorators";
import { retrieveRecordComments } from "../../services/records";

class RecordHandler {
  @Get("/")
  public retrieveAllRecordComments(
    @Param("contentfulId") contentfulId: string
  ) {
    return retrieveRecordComments(contentfulId);
  }
}

export default createHandler(RecordHandler);
