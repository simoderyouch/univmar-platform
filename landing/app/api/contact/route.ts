import { NextResponse } from "next/server";
import { sendContactEmail, validateContactPayload } from "@/lib/contactEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = validateContactPayload(body);

    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    await sendContactEmail(validated.data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }
}
