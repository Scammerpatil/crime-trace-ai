import Case from "@/models/Case";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cases = await Case.find()
      .populate("investigator", "name email")
      .populate("suspect", "name age");
    return NextResponse.json({ cases }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch cases" },
      { status: 500 }
    );
  }
}
