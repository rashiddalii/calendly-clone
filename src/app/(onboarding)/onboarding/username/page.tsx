import { redirect } from "next/navigation"

/** Legacy URL — username is assigned at signup; continue the new wizard at role selection. */
export default async function OnboardingUsernameRedirectPage() {
  redirect("/onboarding/role")
}
