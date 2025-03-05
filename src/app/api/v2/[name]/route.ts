import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    console.log("Start");
    const { name } = await params;
    console.log(`1`);
    if (!name) {
      return NextResponse.json(
        { error: "Missing 'name' parameter" },
        { status: 400 },
      );
    }

    console.log(`2`);
    // Extract pagination parameters from query
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Fetch logs with pagination
    const project = await prisma.project.findUnique({
      where: { name },
      include: {
        logs: {
          skip,
          take: limit,
        },
      },
    });

    console.log(`3`);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get total count of logs for pagination metadata
    const totalLogs = await prisma.log.count({
      where: { projectId: project.id },
    });

    console.log(`1`);
    return NextResponse.json(
      {
        data: project,
        message: "Successfully fetched logs",
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalLogs / limit),
          totalLogs,
          limit,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch Logs Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const { name } = await params;
    const { level = "info", message, meta } = await request.json();
    if (!name || !message) {
      return NextResponse.json(
        { error: "Missing 'name' or 'message' parameter" },
        { status: 404 },
      );
    }

    const isProjectExist = await prisma.project.findUnique({
      where: { name: name },
    });
    if (!isProjectExist) {
      const logs = await prisma.project.create({
        data: {
          name: name,
          logs: {
            create: {
              level: level,
              message: message,
              metadata: meta,
            },
          },
        },
        include: {
          logs: true,
        },
      });

      return NextResponse.json(
        {
          data: logs,
          message: `Log saved in collection: ${name}`,
        },

        { status: 200 },
      );
    }
    const logs = await prisma.project.update({
      where: { name: name },
      data: {
        logs: {
          create: {
            level: level,
            message: message,
            metadata: meta,
          },
        },
      },
    });
    return NextResponse.json(
      {
        data: logs,
        message: `Log saved in collection: ${name}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Logging Error:", error);
    return NextResponse.json(
      { error: error, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
