// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";
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
 * This function queries the Redis database to check if the sessionId and userId
 * match the ones stored in the database. If they do, the request is forwarded
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
      return new NextResponse(
        JSON.stringify({
          ok: false,
          message: "Invalid identity presented",
        }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }
  } else {
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

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/api/records/:path*",
};
