import { redirect } from "next/navigation"

/** Legacy URL — timezone is configured in step 4 of the new wizard. */
export default async function OnboardingTimezoneRedirectPage() {
  redirect("/onboarding/availability")
}
