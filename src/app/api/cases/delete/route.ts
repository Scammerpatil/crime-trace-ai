import Case from "@/models/Case";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }
  try {
    const deletedCase = await Case.findByIdAndDelete(id);
    if (!deletedCase) {
      return NextResponse.json({ message: "Case not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Case deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Case:", error);
    return NextResponse.json(
      { message: "Error deleting Case" },
      { status: 500 }
    );
  }
}
