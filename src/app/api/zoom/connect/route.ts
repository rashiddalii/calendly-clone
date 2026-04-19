import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  redirect("/integrations?error=zoom_in_progress")
}
