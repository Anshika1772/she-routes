import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { code?: string | string[] }
}) {
  const supabase = await createClient()

  const code =
    typeof searchParams.code === "string"
      ? searchParams.code
      : searchParams.code?.[0]

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  redirect("/dashboard")
}
