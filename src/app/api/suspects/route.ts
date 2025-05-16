import Suspect from "@/models/Suspect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const suspects = await Suspect.find();
    if (!suspects) {
      return NextResponse.json(
        { message: "No suspects found" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "suspects fetched successfully", suspects },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching suspects:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
