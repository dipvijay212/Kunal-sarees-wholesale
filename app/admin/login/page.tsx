"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { adminAuthStore, loginAdmin } from "@/lib/admin-stores";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to admin
    const token = typeof window !== "undefined" ? localStorage.getItem("ks:admin:jwt:v1") : null;
    const session = adminAuthStore.getSnapshot();
    if (session.isAuthenticated || token) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginAdmin(email, password);
      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-deep px-4 py-12">
      <Container size="narrow" className="max-w-md">
        <div className="rounded-xs border border-line bg-canvas p-8 shadow-sm">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xs bg-accent text-lg font-bold text-accent-contrast">
              KS
            </div>
            <h1 className="type-h3 mt-4 font-serif text-ink">Kunal Sarees Admin</h1>
            <p className="mt-1 text-xs text-muted">
              Enter your credentials to access the wholesale admin management portal.
            </p>
          </div>

          {/* Error Message */}
          {error ? (
            <div className="mt-4 rounded-xs bg-alert-fill p-3 text-xs font-medium text-alert text-center">
              {error}
            </div>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink">Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@kunalsarees.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-ink">Password</label>
                <Link
                  href="/forgot-password?type=admin"
                  className="text-xs text-accent hover:underline focus:outline-none"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>

            <Button type="submit" size="lg" fullWidth className="mt-2" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In to Admin Portal"}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
