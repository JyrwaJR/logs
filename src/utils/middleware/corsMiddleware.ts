import { MiddlewareFactory } from "@/types/middleware";

const allowedOrigins = ["http://localhost:3000"]; // Add your allowed domains

export const corsMiddleware: MiddlewareFactory =
  (next) => async (request, event, response) => {
    const origin = request.headers.get("Origin");
    // const project = await prisma.project.findMany();
    if (!origin || !allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({ message: "CORS Not Allowed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: response.headers });
    }
    return next(request, event, response);
  };
