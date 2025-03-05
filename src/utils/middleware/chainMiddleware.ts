import { CustomMiddleware, MiddlewareFactory } from "@/types/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export function chainMiddleware(
  functions: MiddlewareFactory[],
  index = 0,
): CustomMiddleware {
  const current = functions[index];

  if (current) {
    const next = chainMiddleware(functions, index + 1);
    return current(next);
  }

  return (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    return response;
  };
}
