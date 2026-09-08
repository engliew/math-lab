"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SoftShapes, StarBurst } from "@/components/playful-bits";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiLogin } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { student, loading, setStudent } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && student) router.replace("/lab");
  }, [loading, student, router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const next = await apiLogin({ username, password });
      setStudent(next);
      router.push("/lab");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in.");
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
            <StarBurst className="h-10 w-10" />
            <CardTitle className="text-2xl">Welcome back!</CardTitle>
            <CardDescription>
              Log in to pick up your Cambridge Primary path.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {error ? (
                <p className="text-sm font-semibold text-red-700" role="alert">
                  {error}
                </p>
              ) : null}
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Logging in…" : "Log in"}
              </Button>
              <p className="text-center text-sm font-semibold text-muted-foreground">
                New here?{" "}
                <Link href="/register" className="text-primary underline">
                  Make a card
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
