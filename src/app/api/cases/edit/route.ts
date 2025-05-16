import Case from "@/models/Case";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Case ID is required" },
      { status: 400 }
    );
  }
  const { formData } = await req.json();
  try {
    const Cases = await Case.findByIdAndUpdate(
      id,
      { ...formData },
      { new: true }
    );
    if (!Cases) {
      return NextResponse.json({ message: "Case not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Case updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Case:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
