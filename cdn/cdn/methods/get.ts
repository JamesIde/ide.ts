import { Env } from "../cloudflare-worker";
import { ExecutionContext } from "@cloudflare/workers-types";
import { createErrorResponse, createResponse } from "../utils/utils";

/**
 * Method retrieves the image from the Cloudflare R2 bucket and caches the image for 30 days.
 */

const CACHE_TIME = 60 * 60 * 24 * 30;

export async function Get(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);

  const key = url.pathname.slice(1);

  if (!key || key === "") {
    return createErrorResponse("No path specified", 400);
  }

  try {
    const object = await env.MY_BUCKET.get(key);
    if (object === null) return createErrorResponse("File not found", 404);

    const cacheKey = new Request(url.toString(), request);
    const cache = (caches as any).default;

    let cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Nefarious any to allow the http metadata to be written for the cache (I think...)
    const headers = new Headers() as any;

    headers.set("etag", object.httpEtag);
    headers.set("Content-Type", "image/webp");
    headers.set("Cache-Control", `max-age=${CACHE_TIME}`);
    headers.set("Access-Control-Allow-Origin", "*");

    object.writeHttpMetadata(headers);

    var data = await object.arrayBuffer();

    var response = createResponse(data, {
      status: 200,
      headers,
      cf: {
        image: {
          format: "webp",
          quality: 85,
        },
      },
    });

    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return createErrorResponse(message, 500);
  }
}
