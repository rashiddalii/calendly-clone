"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PasswordSignInForm } from "@/components/auth/password-sign-in-form"
import { PasswordSignUpForm } from "@/components/auth/password-sign-up-form"
import { EmailSignInForm } from "@/components/auth/email-sign-in-form"

interface AuthTabsProps {
  mode: "signin" | "signup"
}

export function AuthTabs({ mode }: AuthTabsProps) {
  const contentMinHeight = mode === "signup" ? "min-h-[216px]" : "min-h-[188px]"

  return (
    <Tabs defaultValue="password" className="w-full">
      <TabsList className="mb-5 grid h-11 w-full grid-cols-2 rounded-[10px] bg-[#F1F5F9] p-1">
        <TabsTrigger
          value="password"
          className="h-full cursor-pointer rounded-[8px] text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Email and password
        </TabsTrigger>
        <TabsTrigger
          value="magic-link"
          className="h-full cursor-pointer rounded-[8px] text-[14px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Magic link
        </TabsTrigger>
      </TabsList>

      <div className={contentMinHeight}>
        <TabsContent value="password">
          {mode === "signin" ? <PasswordSignInForm /> : <PasswordSignUpForm />}
        </TabsContent>

        <TabsContent value="magic-link">
          <EmailSignInForm variant="marketing" />
        </TabsContent>
      </div>
    </Tabs>
  )
}
