import type { NextApiResponse, NextApiRequest } from "next";
import { createHandler, Get, Param, Post, Req, Res } from "next-api-decorators";
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

  @Post("/:contentfulId")
  public async updateRecordViewCount(
    @Param("contentfulId") contentfulId: string
  ) {
    return await this.recordService.updateRecordViewCount(contentfulId);
  }
}

export default createHandler(RecordHandler);
