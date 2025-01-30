import { NextRequest, NextResponse } from "next/server";
import { client } from "../../../../../prisma/client";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const name = (await params).name;
  const data = await client.minErrorLog.findMany({
    where: { project: { name: name } },
  });
  return NextResponse.json({ data });
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const body = await req.json();
    const name = (await params).name;
    const isProjectPresent = await client.project.findFirst({
      where: {
        name: name,
      },
    });
    if (!isProjectPresent) {
      const project = await client.project.create({
        data: {
          name: name,
        },
      });
      if (project) {
        const log = await client.minErrorLog.create({
          data: {
            ...body,
            projectId: project.id,
          },
        });
        return NextResponse.json({
          data: log,
          message: "Log created successfully",
        });
      }
      return NextResponse.json({
        data: project,
      });
    }
    const log = await client.minErrorLog.create({
      data: {
        ...body,
        projectId: isProjectPresent.id,
      },
    });
    return NextResponse.json({
      data: log,
      log: "Log created successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      data: error,
      success: false,
    });
  }
}
