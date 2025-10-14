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
    /**
     * The R2 bucket is publicly available under its own domain (assets.jamesaide.com).
     * The worker makes the request against the bucket with the image transformation props.
     * Ideally we want the worker to directly transform the object when pulled from R2 using the env.MYBUCKET.get(key) method but that is not possible.
     * https://www.reddit.com/r/CloudFlare/comments/1j19be7/comment/mfi8t18/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
     */

    const width = url.searchParams.get("width") || url.searchParams.get("w");
    const height = url.searchParams.get("height") || url.searchParams.get("h");
    const quality = parseInt(url.searchParams.get("quality") || url.searchParams.get("q")) || 85;

    return fetch(`https://${env.ASSETS_PUBLIC_URL}/${key}`, {
      cf: {
        image: {
          fit: "scale-down",
          width: width ? parseInt(width) : undefined,
          height: height ? parseInt(height) : undefined,
          quality: quality,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return createErrorResponse(message, 500);
  }
}
