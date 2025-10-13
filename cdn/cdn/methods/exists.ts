import { Env } from "../cloudflare-worker";
import { ExecutionContext } from "@cloudflare/workers-types";
import { createErrorResponse, createResponse, validateIdentity } from "../utils/utils";

export async function Exists(request: Request, env: Env, ctx: ExecutionContext, fileName: string): Promise<Response> {
  try {
    if (!validateIdentity(request)) {
      return createErrorResponse("Unauthorized", 401);
    }

    var exists = await env.MY_BUCKET.head(fileName);

    if (exists) {
      const headers = new Headers();
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Content-Type", "application/json");

      return createResponse(JSON.stringify(exists), {
        status: 200,
        headers,
      });
    }

    return createErrorResponse("File not found", 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return createErrorResponse(message, 500);
  }
}
