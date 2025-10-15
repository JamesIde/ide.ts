import { env } from "process";

export function createResponse(body: any, init?: any & { cf?: any }): Response {
  return new Response(body, init);
}

export function createErrorResponse(message: string, status: number) {
  var response = {
    response: message,
  };
  return new Response(JSON.stringify(response), {
    status: status,
    headers: { "Content-Type": "application/json" },
  });
}

export function validateIdentity(request: Request): boolean {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) return false;

  const authString = authHeader.slice(6);

  if (authString !== env.BASIC_AUTH_HASH) return false;

  return true;
}
