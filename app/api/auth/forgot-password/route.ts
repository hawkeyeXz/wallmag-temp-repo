// /app/api/auth/forgot-password/route.ts
import RegisteredUsers from "@/app/models/RegisteredUser";
import { dbConnect } from "@/lib/mongoose";
import redis from "@/lib/redis";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function cachedOtp(id_number: string, hash: string, ttlSeconds = 300) {
    const key = `forgot:${id_number}`;
    await redis.hSet(key, { hash, verified: "false" });
    await redis.expire(key, ttlSeconds);
}

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { id_number } = body;

        if (!id_number || typeof id_number !== "string") {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        const user = await RegisteredUsers.findOne({ id_number });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const otp = generateOtp();
        const otpHash = await bcrypt.hash(otp, 11);
        await cachedOtp(id_number, otpHash, 300);
        console.log(`Generated OTP for ${id_number}: ${otp}`);

        // Send OTP via email
        const msg = {
            to: user.email,
            from: { email: process.env.SENDGRID_SENDER_EMAIL!, name: "Wall-Magazine" },
            subject: "Wall-Magazine Password Reset OTP",
            html: `<p>Hello ${user.name || "User"},</p>
                   <p>Your OTP is:</p>
                   <h2>${otp}</h2>
                   <p>This code expires in 5 minutes.</p>`,
        };

        // await sgMail.send(msg);

        // Create short-lived JWT in cookie
        const forgotToken = jwt.sign({ id_number }, process.env.JWT_SECRET!, { expiresIn: "5m" });
        const cookieStore = await cookies();
        cookieStore.set("forgot_token", forgotToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "lax",
            maxAge: 5 * 60, // 5 minutes
        });

        return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
    } catch (err) {
        console.error("Forgot-password error:", err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
