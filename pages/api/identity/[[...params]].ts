import type { NextApiResponse, NextApiRequest } from "next";
import {
  createHandler,
  Get,
  Post,
  Param,
  Req,
  Res,
  Body,
} from "next-api-decorators";
import { autoInjectable } from "tsyringe";
import { GoogleOAuthResponse } from "./auth.dto";
import { IdentityService } from "./identity.service";

@autoInjectable()
export class IdentityHandler {
  constructor(private identityService: IdentityService) {}

  @Post("/")
  public async handleIdentityToken(
    @Res() res: NextApiResponse,
    @Body() GoogleResponse: GoogleOAuthResponse
  ) {
    return await this.identityService.handleIdentityToken(
      res,
      GoogleResponse.OAuthToken
    );
  }

  @Get("/")
  public async handleAccessTokenRefresh(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse
  ) {
    return await this.identityService.handleTokenRefresh(req, res);
  }
}

export default createHandler(IdentityHandler);
