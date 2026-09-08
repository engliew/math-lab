"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { BrandMark } from "@/components/brand-mark";
import { CountBuddy, SoftShapes, StarBurst } from "@/components/playful-bits";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();
  const { student, loading } = useAuth();

  useEffect(() => {
    if (!loading && student) router.replace("/lab");
  }, [loading, student, router]);

  if (loading || student) {
    return (
      <AppShell showSignOut={false}>
        <p className="text-muted-foreground">Opening Math Lab…</p>
      </AppShell>
    );
  }

  return (
    <AppShell showSignOut={false}>
      <div className="relative mx-auto flex w-full max-w-xl flex-col gap-6">
        <SoftShapes />
        <div className="relative space-y-4 text-center">
          <div className="flex justify-center">
            <BrandMark />
          </div>
          <div className="flex items-center justify-center gap-2">
            <StarBurst className="h-8 w-8" />
            <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Maths that feels like play
            </h1>
            <StarBurst className="h-8 w-8" />
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground">
            For children ages 5 to 12. Start in Preschool, then walk Year 1 to
            Year 6 along Cambridge Primary Mathematics. Make a card, log in, and
            your path stays with you.
          </p>
        </div>

        <Card className="relative overflow-hidden">
          <CardHeader className="items-center text-center">
            <CountBuddy className="h-20 w-24" />
            <CardTitle className="text-2xl">Ready to practise?</CardTitle>
            <CardDescription>
              A lesson is 20 questions. Score 19 to move on — or 15–18 to earn a
              retry.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/register">I am new — make my card</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full">
              <Link href="/login">I have a card — log in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
