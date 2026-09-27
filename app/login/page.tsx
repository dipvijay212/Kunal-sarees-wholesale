"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/FormField";
import { LockIcon, PhoneIcon, UserIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useCustomer } from "@/hooks/use-customer";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const isHi = language === "hi";
  const { isAuthenticated, login } = useCustomer();

  const redirectUrl = searchParams.get("redirect") || "/account";
  const initialPhone = searchParams.get("phone") || "";

  const [phone, setPhone] = useState(initialPhone);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setError(
        isHi
          ? "कृपया सही 10 अंकों का मोबाइल नंबर डालें।"
          : "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!password || password.length < 8) {
      setError(
        isHi
          ? "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।"
          : "Password must be at least 8 characters."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(cleanPhone, password);
      if (res.success) {
        router.replace(redirectUrl);
      } else {
        setError(
          res.error ||
            (isHi
              ? "मोबाइल नंबर या पासवर्ड गलत है।"
              : "Invalid mobile number or password.")
        );
      }
    } catch {
      setError(
        isHi
          ? "लॉगिन करने में त्रुटि हुई। कृपया पुनः प्रयास करें।"
          : "An error occurred during login. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xs border border-line bg-canvas p-6 sm:p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <UserIcon size={24} />
          </div>
          <h2 className="type-h3 text-ink">{t.auth.loginTitle}</h2>
          <p className="mt-1 text-xs text-muted">{t.auth.loginSubtitle}</p>
        </div>

        {error ? (
          <div className="mb-5 rounded-xs border border-danger/30 bg-danger/5 p-3 text-xs text-danger">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="login-phone" className="field-label flex items-center gap-1.5">
              <PhoneIcon size={14} className="text-muted" />
              {t.auth.phone} <span className="text-accent">*</span>
            </label>
            <Input
              id="login-phone"
              type="tel"
              placeholder={t.auth.phonePlaceholder}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError(null);
              }}
              maxLength={10}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="field-label flex items-center gap-1.5">
                <LockIcon size={14} className="text-muted" />
                {t.auth.password} <span className="text-accent">*</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-accent hover:underline focus:outline-none"
              >
                {t.auth.forgotPassword}
              </Link>
            </div>
            <Input
              id="login-password"
              type="password"
              placeholder={t.auth.passwordPlaceholder}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
            />
          </div>

          <div className="mt-2">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting
                ? (isHi ? "लॉगिन हो रहा है..." : "Logging in...")
                : t.auth.loginButton}
            </Button>
          </div>
        </form>

        <div className="mt-6 border-t border-line/60 pt-5 text-center text-xs text-muted">
          <p>{t.auth.noAccountNotice}</p>
          <div className="mt-3 flex justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center text-accent hover:underline font-medium"
            >
              {isHi ? "साड़ियां देखें" : "Browse Sarees"} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  return (
    <>
      <PageHeader
        eyebrow={isHi ? "ग्राहक खाता" : "Customer Account"}
        title={t.auth.loginTitle}
        description={t.auth.loginSubtitle}
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.auth.loginTitle },
        ]}
      />

      <section className="section-y-sm">
        <Container>
          <Suspense
            fallback={
              <div className="py-12">
                <LoadingState variant="lines" count={3} label={t.loading.default} />
              </div>
            }
          >
            <LoginFormContent />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
