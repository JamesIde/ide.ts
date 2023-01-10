import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt_decode from "jwt-decode";
import { JWTPayload } from "./@types/Token";
import prisma from "./lib/prisma";
export const config = {
  matcher: "/api/comments/:path",
};
export function middleware(request: NextRequest) {
  return isAuthenticated(request);
}

export async function isAuthenticated(request: NextRequest) {
  const token = request.headers.get("authorization");
  if (!token)
    return new NextResponse(
      JSON.stringify({ ok: false, message: "No valid identity presented" }),
      { status: 403, headers: { "content-type": "application/json" } }
    );

  try {
    const decoded: JWTPayload = jwt_decode(token.split(" ")[1]);
    if (decoded.QcP < new Date(Date.now())) {
      return new NextResponse(
        JSON.stringify({ ok: false, message: "Token expired" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // Clone the headers
    const requestHeaders = new Headers(request.headers);
    // Sets new headers
    requestHeaders.set("user", decoded.id);
    console.log("user in header", decoded.id);
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    return response;
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        ok: false,
        message: "Error establishing your identity",
      }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }
}

/**
 * In the middleware
 *
 * First of all, we need a function to validate the auth token (only for /api/comments)
 * This checks & decodes token, returns a 404/401 if invalid.
 * If not invalid, set a new header with the decoded token information :)
 */
