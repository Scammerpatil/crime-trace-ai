import Investigator from "@/models/Investigator";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const investigators = await Investigator.find();
    if (!investigators) {
      return NextResponse.json(
        { message: "No investigators found", investigators: [] },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Investigators fetched successfully", investigators },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching investigators:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
