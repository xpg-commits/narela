import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { OnboardingSlides } from "@/components/onboarding/onboarding-slides"

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <OnboardingSlides />
    </div>
  )
}
