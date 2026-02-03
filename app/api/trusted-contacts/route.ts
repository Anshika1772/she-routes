import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
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

    const { data, error } = await supabase
      .from("trusted_contacts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ contacts: data });
  } catch (error) {
    console.error("Get contacts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

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

    const { name, phone, email, relationship } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("trusted_contacts")
      .insert({
        user_id: user.id,
        name,
        phone,
        email: email || null,
        relationship: relationship || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Contact added successfully", contact: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add contact error:", error);
    return NextResponse.json(
      { error: "Failed to add contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("id");

    if (!contactId) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("trusted_contacts")
      .delete()
      .eq("id", contactId)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
