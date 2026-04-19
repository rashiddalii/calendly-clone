import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { msOAuthUrl } from "@/lib/services/teams"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  if (!process.env.MICROSOFT_CLIENT_ID) {
    redirect("/integrations?error=teams_not_configured")
  }

  redirect(msOAuthUrl())
}
