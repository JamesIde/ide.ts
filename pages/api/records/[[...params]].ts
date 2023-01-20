import type { NextApiResponse, NextApiRequest } from "next";
import { createHandler, Get, Param, Req, Res } from "next-api-decorators";
import { autoInjectable } from "tsyringe";
import { RecordService } from "./records.service";

@autoInjectable()
class RecordHandler {
  constructor(private recordService: RecordService) {}

  @Get("/:contentfulId")
  public async retrieveAllRecordComments(
    @Param("contentfulId") contentfulId: string
  ) {
    return await this.recordService.retrieveRecordComments(contentfulId);
  }
}

export default createHandler(RecordHandler);
