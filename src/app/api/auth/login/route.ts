import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a valid email and password." }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  const isValid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  await setSessionCookie({ userId: user.id, role: user.role });

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}