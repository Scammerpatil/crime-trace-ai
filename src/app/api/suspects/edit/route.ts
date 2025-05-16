import Suspect from "@/models/Suspect";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Suspect ID is required" },
      { status: 400 }
    );
  }
  const { formData } = await req.json();
  try {
    const suspects = await Suspect.findByIdAndUpdate(
      id,
      { ...formData },
      { new: true }
    );
    if (!suspects) {
      return NextResponse.json(
        { message: "Suspect not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Suspect updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Suspect:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
