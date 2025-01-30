import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  try {
    // Proceed with the request
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error,
      },
      { status: 500 },
    );
  }
};
