// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";
import * as Sentry from "@sentry/nextjs";
export async function middleware(request: NextRequest, response: NextResponse) {
  const session = await getIronSession(request, response, {
    password: process.env.IRON_SESSION,
    cookieName: "jid",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1, // 1 hour
    },
  });

  if (!session.user) {
    Sentry.captureMessage("No identity presented to middleware", {
      tags: {
        code: "middleware",
      },
    });

    return new NextResponse(
      JSON.stringify({
        ok: false,
        message: "No identity presented",
      }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }
  return await queryRedis(session.user.sessionId, session.user.userId, request);
}

/*
 * Function to query redis and check if session in cookie matches session stored
 */
async function queryRedis(
  sessionId: string,
  userId: string,
  request: NextRequest
) {
  const redisQuery = await fetch(
    process.env.UPSTASH_FETCH_API_URL + `/hget/sessions/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_FETCH_API_TOKEN}`,
      },
    }
  );

  if (redisQuery.ok) {
    const data = await redisQuery.json();
    if (data.result === userId) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("user", data.result);
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      return response;
    } else {
      Sentry.captureMessage("No identity presented to middleware", {
        tags: {
          code: "middleware",
        },
      });
      return new NextResponse(
        JSON.stringify({
          ok: false,
          message: "Invalid identity presented",
        }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }
  } else {
    Sentry.captureMessage(redisQuery.statusText, {
      tags: {
        code: "middleware",
      },
    });

    return new NextResponse(
      JSON.stringify({
        ok: false,
        message: redisQuery.statusText,
      }),
      {
        status: redisQuery.status,
        headers: { "content-type": "application/json" },
      }
    );
  }
}

export const config = {
  matcher: "/api/comments/:path*",
};
