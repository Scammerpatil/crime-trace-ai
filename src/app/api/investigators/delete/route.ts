import Investigator from "@/models/Investigator";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Investigator ID is required" },
      { status: 400 }
    );
  }
  try {
    const investigator = await Investigator.findByIdAndDelete(id);
    if (!investigator) {
      return NextResponse.json(
        { message: "Investigator not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Investigator deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting investigator:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
