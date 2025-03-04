import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";

// ✅ GET: Fetch logs by collection name
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const { name } = await params;
    if (!name) {
      return NextResponse.json(
        { error: "Missing 'name' parameter" },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const totalLogs = await prisma.log.count({
      where: { project: name },
    });
    const skip = (page - 1) * pageSize;
    if (name === "all") {
      const logs = await prisma.log.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      });
      return NextResponse.json(
        {
          logs: logs,

          pagination: {
            totalLogs,
            totalPages: Math.ceil(totalLogs / pageSize),
            currentPage: page,
            pageSize,
          },
        },
        { status: 400 },
      );
    }

    // Fetch paginated logs
    const logs = await prisma.log.findMany({
      where: { project: name },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });

    // Get total log count for pagination metadata

    return NextResponse.json({
      logs,
      pagination: {
        totalLogs,
        totalPages: Math.ceil(totalLogs / pageSize),
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Fetch Logs Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// ✅ POST: Save logs using Winston
export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const { name } = await params;
    const { level = "info", message, meta } = await request.json();

    if (!name || !message) {
      return NextResponse.json(
        { error: "Missing 'name' or 'message' parameter" },
        { status: 400 },
      );
    }

    // ✅ Save log in MongoDB via Prisma for querying
    await prisma.log.create({
      data: {
        project: name,
        level,
        message,
        stack: meta?.stack || null,
        metadata: meta,
        createdAt: new Date(),
      },
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
