import { NextRequest, NextResponse } from "next/server";
import { client } from "../../../../../prisma/client";
import loggers from "../../../../utils/loggers";
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const { name } = params;
    if (!name) {
      return NextResponse.json(
        { error: "Missing collection name" },
        { status: 400 },
      );
    }

    // Fetch logs by collection name
    const logs = await client.log.findMany({
      where: { name: name },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ logs }, { status: 200 });
  } catch (error) {
    console.error("Fetch Logs Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, level = "info", message, meta } = await request.json();

    if (!name || !message) {
      return NextResponse.json(
        { error: "Missing 'name' or 'message' parameter" },
        { status: 400 },
      );
    }

    // Log using Winston
    loggers.log({
      level,
      message,
      metadata: { collectionName: name, ...meta },
    });

    return NextResponse.json(
      { message: `Log saved in collection: ${name}` },
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
