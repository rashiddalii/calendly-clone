"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ChevronsLeft,
  ChevronsRight,
  Link2,
  LogOut,
  Paintbrush,
  User,
} from "lucide-react";
import { handleSignOut } from "@/lib/actions/auth";
import { FluidLogo } from "@/components/shared/fluid-logo";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "fluid-account-sidebar-collapsed";

const navItems = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/branding", label: "Branding", icon: Paintbrush },
  { href: "/account/my-link", label: "My Link", icon: Link2 },
];

const PRIMARY = "#006BFF";
const ACTIVE_BG = "rgba(0, 107, 255, 0.09)";

export function AccountSettingsSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
      try {
        if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true);
      } catch {
        /* private mode / SSR */
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const isCollapsed = mounted && collapsed;

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[#E5E7EB] bg-white transition-[width] duration-200 ease-out lg:flex",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo row */}
      <div
        className={cn(
          "flex pb-3 pt-4",
          isCollapsed
            ? "flex-col items-center gap-2 px-2"
            : "items-center justify-between gap-2 px-4"
        )}
      >
        <FluidLogo
          href="/events"
          size="sm"
          showText={!isCollapsed}
          className={cn(
            "rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#006BFF]/30",
            isCollapsed ? "justify-center p-1.5" : "min-w-0 flex-1"
          )}
        />
        <button
          type="button"
          onClick={toggle}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#374151]"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Back to home */}
      <div className={cn("pb-3", isCollapsed ? "px-1.5" : "px-4")}>
        <Link
          href="/events"
          title="Back to home"
          className={cn(
            "flex cursor-pointer items-center rounded-lg text-sm font-medium text-[#374151] transition-colors hover:bg-[#F3F4F6] hover:text-[#1c2b4b]",
            isCollapsed ? "justify-center p-2.5" : "gap-2 px-3 py-2"
          )}
        >
          <ArrowLeft className="h-4 w-4 shrink-0 text-[#6B7280]" />
          {isCollapsed ? (
            <span className="sr-only">Back to home</span>
          ) : (
            "Back to home"
          )}
        </Link>
      </div>

      {/* Nav items */}
      <div
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden pb-6",
          isCollapsed ? "px-1.5" : "px-3"
        )}
      >
        {!isCollapsed && (
          <p className="px-2 pb-1 pt-0.5 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
            Account settings
          </p>
        )}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            if (isCollapsed) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "flex justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-[#006BFF]"
                      : "text-[#374151] hover:bg-[#F3F4F6]"
                  )}
                  style={isActive ? { backgroundColor: ACTIVE_BG } : undefined}
                >
                  <item.icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: isActive ? PRIMARY : undefined }}
                  />
                  <span className="sr-only">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 items-center overflow-hidden rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "py-2 pr-3 pl-0 text-[#006BFF]"
                    : "gap-3 px-3 py-2 text-[#374151] hover:bg-[#F3F4F6]"
                )}
                style={isActive ? { backgroundColor: ACTIVE_BG } : undefined}
              >
                {isActive ? (
                  <>
                    <span
                      className="w-1 shrink-0 self-stretch rounded-l-lg"
                      style={{ backgroundColor: PRIMARY }}
                      aria-hidden
                    />
                    <span className="flex min-w-0 items-center gap-3 pl-2">
                      <item.icon
                        className="h-4 w-4 shrink-0"
                        style={{ color: PRIMARY }}
                      />
                      {item.label}
                    </span>
                  </>
                ) : (
                  <>
                    <item.icon className="h-4 w-4 shrink-0 text-[#6B7280]" />
                    {item.label}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div
        className={cn(
          "border-t border-[#E5E7EB] py-3",
          isCollapsed ? "px-1.5" : "px-3"
        )}
      >
        <form action={handleSignOut}>
          <button
            type="submit"
            title="Logout"
            className={cn(
              "flex w-full cursor-pointer items-center rounded-lg text-sm font-medium text-[#374151] transition-colors hover:bg-[#F3F4F6]",
              isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0 text-[#6B7280]" />
            {isCollapsed ? <span className="sr-only">Logout</span> : "Logout"}
          </button>
        </form>
      </div>
    </aside>
  );
}
