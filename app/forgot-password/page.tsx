"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/FormField";
import { ArrowLeftIcon, MailIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { customerAuthApi, authApi } from "@/lib/api";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("type") === "admin";
  const initialEmail = searchParams.get("email") || "";

  const { t, language } = useLanguage();
  const isHi = language === "hi";

  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Handle countdown for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError(
        isHi
          ? "कृपया एक वैध ईमेल पता दर्ज करें।"
          : "Please enter a valid email address."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (isAdmin) {
        await authApi.forgotPassword(cleanEmail);
      } else {
        await customerAuthApi.forgotPassword(cleanEmail);
      }
      setIsSuccess(true);
      setCooldown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : null;
      setError(
        msg ||
          (isHi
            ? "रीसेट लिंक भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।"
            : "Failed to send reset link. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginHref = isAdmin ? "/admin/login" : "/login";

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xs border border-line bg-canvas p-6 sm:p-8 shadow-sm">
        {isSuccess ? (
          <div className="text-center animate-fadeIn">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <MailIcon size={28} />
            </div>
            <h2 className="type-h3 text-ink">
              {t.auth.checkYourEmail || (isHi ? "अपना ईमेल चेक करें" : "Check Your Email")}
            </h2>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              {t.auth.resetEmailSentDesc ||
                (isHi
                  ? `यदि इस ईमेल से कोई अकाउंट जुड़ा है (${email}), तो हमने पासवर्ड रीसेट लिंक भेज दिया है।`
                  : `If an active account is registered with ${email}, we have sent instructions to reset your password.`)}
            </p>

            <div className="mt-5 rounded-xs border border-accent/20 bg-accent/5 p-3.5 text-xs text-ink/80 text-left">
              <div className="flex items-start gap-2.5">
                <ShieldCheckIcon size={18} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-ink">
                    {isHi ? "30 मिनट की वैधता" : "30-Minute Expiry"}
                  </p>
                  <p className="mt-0.5 text-muted">
                    {isHi
                      ? "सुरक्षा कारणों से यह लिंक 30 मिनट में समाप्त हो जाएगा।"
                      : "For your security, the reset link will expire in 30 minutes."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                disabled={cooldown > 0 || isSubmitting}
                onClick={handleSubmit}
                fullWidth
              >
                {cooldown > 0
                  ? `${t.auth.resendIn || (isHi ? "दोबारा भेजें" : "Resend in")} (${cooldown}s)`
                  : t.auth.resendLink || (isHi ? "दोबारा लिंक भेजें" : "Resend Link")}
              </Button>

              <Link
                href={loginHref}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-accent hover:underline py-2"
              >
                <ArrowLeftIcon size={14} />
                {t.auth.backToLogin || (isHi ? "लॉगिन पर वापस जाएं" : "Back to Login")}
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <MailIcon size={24} />
              </div>
              <h2 className="type-h3 text-ink">
                {t.auth.forgotPasswordTitle || (isHi ? "पासवर्ड रीसेट करें" : "Reset Password")}
              </h2>
              <p className="mt-1 text-xs text-muted">
                {t.auth.forgotPasswordSubtitle ||
                  (isHi
                    ? "अपना रजिस्टर्ड ईमेल पता डालें, हम आपको पासवर्ड रीसेट करने का सुरक्षित लिंक भेजेंगे।"
                    : "Enter your registered email address and we will send you a password reset link.")}
              </p>
            </div>

            {error ? (
              <div className="mb-5 rounded-xs border border-danger/30 bg-danger/5 p-3 text-xs text-danger">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div>
                <label htmlFor="reset-email" className="field-label flex items-center gap-1.5">
                  <MailIcon size={14} className="text-muted" />
                  {t.auth.email || (isHi ? "ईमेल पता" : "Email Address")} <span className="text-accent">*</span>
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder={t.auth.emailPlaceholder || (isHi ? "उदा. name@example.com" : "e.g. name@example.com")}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
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
                    ? t.auth.sendingResetLink || (isHi ? "लिंक भेजा जा रहा है..." : "Sending Link...")
                    : t.auth.sendResetLink || (isHi ? "रीसेट लिंक भेजें" : "Send Reset Link")}
                </Button>
              </div>
            </form>

            <div className="mt-6 border-t border-line/60 pt-5 text-center">
              <Link
                href={loginHref}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                <ArrowLeftIcon size={14} />
                {t.auth.backToLogin || (isHi ? "लॉगिन पर वापस जाएं" : "Back to Login")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  return (
    <>
      <PageHeader
        eyebrow={isHi ? "सुरक्षा एवं रिकवरी" : "Account Security"}
        title={t.auth.forgotPasswordTitle || (isHi ? "पासवर्ड रीसेट करें" : "Reset Password")}
        description={
          t.auth.forgotPasswordSubtitle ||
          (isHi
            ? "अपने कुणाल साड़ीज खाते का पासवर्ड रीसेट करें।"
            : "Request a secure password reset link for your account.")
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.auth.loginTitle, href: "/login" },
          { label: t.auth.forgotPasswordTitle || (isHi ? "पासवर्ड रीसेट" : "Forgot Password") },
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
            <ForgotPasswordContent />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
