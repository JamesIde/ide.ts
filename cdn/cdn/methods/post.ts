import { Env } from "../cloudflare-worker";
import { ExecutionContext } from "@cloudflare/workers-types";
import { createErrorResponse, createResponse, validateIdentity } from "../utils/utils";

export async function Post(request: Request, env: Env, ctx: ExecutionContext) {
  if (!validateIdentity(request)) {
    return createErrorResponse("Unauthorized", 401);
  }

  const filePath = request.headers.get("x-cf-file-path");

  var body = await request.arrayBuffer();

  if (!body) {
    return createErrorResponse("No file uploaded", 400);
  }

  // The body content type is originally octet stream but we force jpeg.
  // Its easier to upload octet stream than form data with the way the request object works
  var uploaded = await env.MY_BUCKET.put(filePath, body, {
    httpMetadata: {
      contentType: "image/jpeg",
    },
  });

  if (!uploaded) {
    return createErrorResponse("No file uploaded", 400);
  }

  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Content-Type", "application/json");

  return createResponse(`${filePath} uploaded`, {
    status: 201,
    headers,
  });
}
