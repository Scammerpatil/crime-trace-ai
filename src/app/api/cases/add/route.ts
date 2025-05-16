import Case from "@/models/Case";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  try {
    const newCase = new Case({
      ...formData,
    });
    await newCase.save();
    return NextResponse.json(
      { message: "Case created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating case:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}
