import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("contacts").insert({
      name,
      email,
      subject: subject || null,
      message,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
