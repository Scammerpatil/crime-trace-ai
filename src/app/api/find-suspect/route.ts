import Case from "@/models/Case";
import haversine from "haversine-distance";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import Suspect from "@/models/Suspect";
const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get("image") as File;
  const caseId = formData.get("caseId") as string;
  if (!caseId || !image) {
    return NextResponse.json(
      { error: "Case ID and image are required" },
      { status: 400 }
    );
  }
  try {
    const imagePath = "python/uploads/suspect.jpg";
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(imagePath, buffer);
    const { stdout } = await execAsync(
      `py -3.12 python/identify_suspect.py "${imagePath}"`
    );
    const suspectedEmail = stdout.trim();
    const suspect = await Suspect.findOne({ email: suspectedEmail });
    const suspectByCase = await findSuspectByCaseDetails(caseId);
    return NextResponse.json(
      { suspect, suspectByCase, message: "Suspect identified successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in find-suspect API:", error);
    return NextResponse.json(
      { error: "Failed to identify suspect" },
      { status: 500 }
    );
  }
}

async function findSuspectByCaseDetails(caseId: string) {
  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) throw new Error("Case not found");

  const allSuspects = await Suspect.find();

  const caseCrimeType = caseDoc.typeOfCrime.toLowerCase();
  const caseDate = new Date(caseDoc.dateOfCrime);
  const caseCoords = caseDoc.location.coordinates;

  let bestMatch: any = null;
  let bestScore = Infinity;

  for (const suspect of allSuspects) {
    for (const record of suspect.criminalRecord) {
      const recordDate = new Date(record.date);
      const dateDiff =
        Math.abs(caseDate.getTime() - recordDate.getTime()) /
        (1000 * 3600 * 24);
      const crimeMatch =
        record.crimeType.toLowerCase() === caseCrimeType ? 0 : 1;

      const suspectCoords = suspect.lastKnownLocation.coordinates;
      const distance = haversine(caseCoords, suspectCoords) / 1000;

      const score = crimeMatch * 50 + dateDiff * 0.2 + distance * 0.5;

      if (score < bestScore) {
        bestScore = score;
        bestMatch = suspect;
      }
    }
  }
  return bestMatch;
}
