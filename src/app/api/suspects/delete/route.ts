import Suspect from "@/models/Suspect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }
  try {
    const deletedSuspect = await Suspect.findByIdAndDelete(id);
    if (!deletedSuspect) {
      return NextResponse.json(
        { message: "Suspect not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Suspect deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting suspect:", error);
    return NextResponse.json(
      { message: "Error deleting suspect" },
      { status: 500 }
    );
  }
}
