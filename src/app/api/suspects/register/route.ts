import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import Suspect from "@/models/Suspect";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { suspect } = await req.json();
  try {
    const { stdout } = await execAsync(
      `py -3.12 python/enroll_suspect.py ${suspect.email}`
    );
    console.log("Building suspect encoding...");
    await execAsync("py -3.12 python/encoding.py");
    console.log("Suspect encoding built successfully");
    const updatedSuspect = await Suspect.findOneAndUpdate(
      { email: suspect.email },
      { isRegistered: true },
      { new: true }
    );
    if (!updatedSuspect) {
      return NextResponse.json({ error: "Suspect not found" }, { status: 404 });
    }
    console.log("Suspect registered successfully");
    return NextResponse.json(
      { message: "Suspect registered successfully", suspect: updatedSuspect },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
