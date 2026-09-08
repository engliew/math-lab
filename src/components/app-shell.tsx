"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

export function AppShell({
  children,
  showSignOut = true,
}: {
  children: React.ReactNode;
  showSignOut?: boolean;
}) {
  const router = useRouter();
  const { student, logout } = useAuth();
  const name = student?.name ?? null;

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b-4 border-secondary/80 bg-card/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href={name ? "/lab" : "/"} aria-label="Math Lab home">
            <BrandMark size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            {name ? (
              <p className="hidden text-sm font-semibold text-foreground sm:block">
                Hi, {name}!
              </p>
            ) : null}
            {showSignOut && name ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
              >
                Log out
              </Button>
            ) : null}
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-5 sm:py-8">
        {children}
      </main>
      <footer className="py-4 text-center text-xs font-semibold text-muted-foreground">
        Math Lab · For kids 5–12 · Cambridge Primary Mathematics
      </footer>
    </div>
  );
}
