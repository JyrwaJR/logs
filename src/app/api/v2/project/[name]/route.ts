import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@prisma/client";

export const GET = async (
  request: NextRequest,
  { params }: { params: { name: string } },
) => {
  try {
    const { name } = await params;
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
    const projects = await prisma.project.findUnique({
      where: { name: name },
      select: {
        name: true,
        id: true,
        logs: {
          take: limit,
          skip,
        },
        createdAt: true,
      },
    });
    return NextResponse.json(
      {
        data: projects,
        message: "Successfully Fetched Project",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch Logs Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
