import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";
import { chainMiddleware } from "./utils/middleware/chainMiddleware";
import { loggerMiddleware } from "./utils/middleware/loggerMiddleware";
import { corsMiddleware } from "./utils/middleware/corsMiddleware";

const chainMi = chainMiddleware([loggerMiddleware, corsMiddleware]);

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  return chainMi(request, event, NextResponse.next());
}

export const config = {
  matcher: ["/api/:path*"], // Example route
};
