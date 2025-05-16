import dbConfig from "@/middlewares/db.config";
import Investigator from "@/models/Investigator";
import { NextRequest, NextResponse } from "next/server";
dbConfig();
export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  try {
    const investigator = new Investigator({
      ...formData,
    });
    await investigator.save();
    if (!investigator) {
      return NextResponse.json(
        { message: "Investigator not added" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Investigator added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding investigator:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
