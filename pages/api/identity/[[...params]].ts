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
import { GoogleOAuthResponse } from "./auth.dto";
import { handleIdentityToken, handleTokenRefresh } from "./identity.service";

export class IdentityHandler {
  @Post("/")
  public handleIdentityToken(
    @Res() res: NextApiResponse,
    @Body() GoogleResponse: GoogleOAuthResponse
  ) {
    return handleIdentityToken(res, GoogleResponse.OAuthToken);
  }

  @Get("/")
  public handleAccessTokenRefresh(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse
  ) {
    return handleTokenRefresh(req, res);
  }
}

export default createHandler(IdentityHandler);
