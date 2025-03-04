import { createLogger } from "@/utils/loggers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const { name } = await params; // 'a', 'b', or 'c'
    const { level = "info", message, meta } = await request.json();
    if (!name || !message) {
      return NextResponse.json(
        { error: "Missing 'name' or 'message' parameter" },
        { status: 400 },
      );
    }

    const logger = createLogger(name); // Create logger with dynamic collection name

    // Log the message
    logger.log({
      level,
      message,
      ...meta,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: `Successfully logged: ${name}`, success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Logging Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
