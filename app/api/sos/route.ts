import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { latitude, longitude, message } = await request.json();

    const { data, error } = await supabase
      .from("sos_alerts")
      .insert({
        user_id: user.id,
        latitude,
        longitude,
        message: message || "Emergency SOS Alert",
        status: "active",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // In a real app, this would trigger notifications to trusted contacts
    // via SMS, push notifications, or email

    return NextResponse.json(
      {
        message: "SOS alert sent successfully!",
        alert: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SOS alert error:", error);
    return NextResponse.json(
      { error: "Failed to send SOS alert. Please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { alertId, status } = await request.json();

    if (!alertId || !status) {
      return NextResponse.json(
        { error: "Alert ID and status are required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("sos_alerts")
      .update({
        status,
        resolved_at: status === "resolved" ? new Date().toISOString() : null,
      })
      .eq("id", alertId)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "Alert updated successfully" });
  } catch (error) {
    console.error("SOS update error:", error);
    return NextResponse.json(
      { error: "Failed to update alert" },
      { status: 500 }
    );
  }
}
