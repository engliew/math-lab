"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CountBuddy, SoftShapes } from "@/components/playful-bits";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRegister } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { student, loading, setStudent } = useAuth();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && student) router.replace("/lab");
  }, [loading, student, router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Those two passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const next = await apiRegister({ username, displayName, password });
      setStudent(next);
      router.push("/lab");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not make your card.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || student) {
    return (
      <AppShell showSignOut={false}>
        <p className="text-muted-foreground">Opening Math Lab…</p>
      </AppShell>
    );
  }

  return (
    <AppShell showSignOut={false}>
      <div className="relative mx-auto w-full max-w-md">
        <SoftShapes />
        <Card className="relative">
          <CardHeader className="items-center text-center">
            <CountBuddy className="h-16 w-20" />
            <CardTitle className="text-2xl">Make your Math Lab card</CardTitle>
            <CardDescription>
              This keeps your progress when you come back on another day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Your name</Label>
                <Input
                  id="displayName"
                  autoComplete="nickname"
                  placeholder="e.g. Amina"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="e.g. amina"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Type the password again</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                />
              </div>
              {error ? (
                <p className="text-sm font-semibold text-red-700" role="alert">
                  {error}
                </p>
              ) : null}
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Making your card…" : "Make my card"}
              </Button>
              <p className="text-center text-sm font-semibold text-muted-foreground">
                Already have a card?{" "}
                <Link href="/login" className="text-primary underline">
                  Log in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
