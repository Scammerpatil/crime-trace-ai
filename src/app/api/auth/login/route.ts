import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import jwt from "jsonwebtoken";

dbConfig();

const generateToken = (data: object) => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

const setTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
  });
};

export async function POST(req: NextRequest) {
  const { formData } = await req.json();

  if (!formData.email || !formData.password) {
    return NextResponse.json(
      { message: "Please fill all the fields", success: false },
      { status: 400 }
    );
  }

  if (
    formData.email === process.env.ADMIN_EMAIL &&
    formData.password === process.env.ADMIN_PASSWORD
  ) {
    const data = {
      id: "admin",
      role: "admin",
      email: process.env.ADMIN_EMAIL,
      name: "Admin",
      profileImage:
        "https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account-man-user-icon.png",
      isVerified: true,
    };
    const token = generateToken(data);
    const response = NextResponse.json({
      message: "Login Success",
      success: true,
      route: `/admin/dashboard`,
      user: data,
    });
    setTokenCookie(response, token);
    return response;
  }
  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
