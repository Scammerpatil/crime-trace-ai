import Suspect from "@/models/Suspect";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { formData } = await req.json();
  const imagePath = path.join(path.resolve(), "public", formData.profileImage);
  try {
    const { stdout } = await execAsync(
      `py -3.12 python/generate_embedding.py "${imagePath}"`
    );
    const faceEmbedding = JSON.parse(stdout.trim());
    const suspect = new Suspect({
      ...formData,
      faceEmbedding: faceEmbedding,
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
