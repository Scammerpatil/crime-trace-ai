import dbConfig from "@/middlewares/db.config";
import Case from "@/models/Case";
import Investigator from "@/models/Investigator";
import Suspect from "@/models/Suspect";
import { NextResponse } from "next/server";

dbConfig();

export async function GET() {
  try {
    const suspects = await Suspect.find();
    const activeCases = await Suspect.countDocuments({ status: "open" });
    const solvedCases = await Suspect.countDocuments({ status: "closed" });
    const cases = await Case.countDocuments();
    const investigators = await Investigator.countDocuments();
    const differencePercentage =
      activeCases + solvedCases === 0
        ? 0
        : Math.round(
            ((activeCases - solvedCases) / (activeCases + solvedCases)) * 100
          );

    const data = {
      suspects: suspects.length,
      investigators,
      cases,
      activeCases,
      solvedCases,
      differencePercentage,
    };

    return NextResponse.json({
      status: 200,
      message: "Admin dashboard data",
      data,
      suspects,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
