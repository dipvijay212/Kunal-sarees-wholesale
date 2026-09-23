"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { loginAdmin } from "@/lib/admin-stores";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kunalsarees.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

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
              Enter your demo credentials to access the wholesale admin management portal.
            </p>
          </div>

          {/* Credentials Info Box */}
          <div className="mt-6 rounded-xs border border-accent/30 bg-accent/5 p-3 text-xs text-ink">
            <p className="font-semibold text-accent uppercase tracking-wider text-[0.625rem]">Demo Login Credentials</p>
            <div className="mt-1 flex justify-between">
              <span className="text-muted">Email:</span>
              <strong className="font-mono text-ink">admin@kunalsarees.com</strong>
            </div>
            <div className="mt-0.5 flex justify-between">
              <span className="text-muted">Password:</span>
              <strong className="font-mono text-ink">Admin@123</strong>
            </div>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xs border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink">Password</label>
              <input
                type="password"
                required
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
