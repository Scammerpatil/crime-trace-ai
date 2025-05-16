import Suspect from "@/models/Suspect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  try {
    const suspect = new Suspect({
      ...formData,
    });
    await suspect.save();
    if (!suspect) {
      return NextResponse.json(
        { message: "Suspect not added" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Suspect added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding suspect:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
