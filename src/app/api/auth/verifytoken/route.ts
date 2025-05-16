import dbConfig from "@/middlewares/db.config";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };
    if (!data) {
      return NextResponse.json({ error: "Invalid token" });
    }
    if (data.id === "admin") {
      return NextResponse.json({ user: data, status: 200 });
    }
    return NextResponse.json({ user: data, status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 401 });
  }
}
