import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@prisma/client";

export const GET = async (request: NextRequest) => {
  try {
    const projects = await prisma.project.findMany({
      select: {
        name: true,
        id: true,
        updatedAt: true,
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
