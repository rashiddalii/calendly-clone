"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { InviteTeamDialog } from "@/components/dashboard/invite-team-dialog";
import { Button } from "@/components/ui/button";

export function DashboardTopbar({
  name,
  email,
  image,
  username,
  marketingHref,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
  /** Public marketing site (e.g. NEXT_PUBLIC_APP_URL or /). */
  marketingHref: string;
}) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex min-h-14 shrink-0 items-center gap-2 border-b border-[#E5E7EB] bg-white px-3 sm:gap-3 sm:px-4 md:px-6">
        <MobileNav />
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-touch w-11 text-[#374151] hover:bg-[#F3F4F6]"
            aria-label="Invite team members"
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus className="h-5 w-5" />
          </Button>
          <UserMenu
            name={name}
            email={email}
            image={image}
            username={username}
            marketingHref={marketingHref}
          />
        </div>
      </header>
      <InviteTeamDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
