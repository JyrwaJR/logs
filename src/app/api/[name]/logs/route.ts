import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { MinErrorLogSchema } from "@/validiation/minErrorLogSchema";
type Params = {
  name: Promise<{ name: string }>;
};
export async function GET(req: NextRequest, { params }: Params) {
  const name = (await params).name;
  const data = await prisma.minErrorLog.findMany({
    where: { project: { name: name } },
    omit: { projectId: true, id: true },
    orderBy: { timestamp: "desc" },
  });
  return NextResponse.json({ data });
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const reqBody = await req.json();
    const isValidData = await MinErrorLogSchema.safeParseAsync(reqBody);
    if (!isValidData.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid request body",
        error: isValidData.error.issues,
      });
    }
    const body = isValidData.data;
    const name = (await params).name;

    const isProjectPresent = await prisma.project.findFirst({
      where: {
        name: name,
      },
    });
    if (!isProjectPresent) {
      const project = await prisma.project.create({
        data: {
          name: name,
          minErrorLogs: {
            create: body,
          },
        },
      });
      if (project) {
        const log = await prisma.minErrorLog.create({
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
    const log = await prisma.minErrorLog.create({
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
