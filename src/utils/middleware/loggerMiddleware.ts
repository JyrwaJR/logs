import { MiddlewareFactory } from "@/types/middleware";

export const loggerMiddleware: MiddlewareFactory =
  (next) => async (request, event, response) => {
    console.log(request.method, "=>", request.url);
    return next(request, event, response);
  };
