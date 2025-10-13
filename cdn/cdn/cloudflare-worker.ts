import { R2Bucket, ExecutionContext } from "@cloudflare/workers-types";
import { Get } from "./methods/get";
import { createErrorResponse, createResponse } from "./utils/utils";
import { Exists } from "./methods/exists";
import { Post } from "./methods/post";

export interface Env {
  MY_BUCKET: R2Bucket;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<RequestInit> {
    if (request.method === "OPTIONS") {
      return createResponse(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (request.method === "GET") {
      var check = !!new URL(request.url).searchParams.get("validate");

      // CDN endpoint for checking if the image exists
      if (check) {
        return await Exists(request, env, ctx, new URL(request.url).pathname.slice(1));
      }

      // CDN endpoint to serve the image
      return await Get(request, env, ctx);
    }

    // CDN endpoint to upload a file
    if (request.method === "POST") {
      return await Post(request, env, ctx);
    }
    return createErrorResponse("Invalid method", 400);
  },
};
