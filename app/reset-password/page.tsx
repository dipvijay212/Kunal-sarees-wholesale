"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/FormField";
import { CheckIcon, LockIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { customerAuthApi, authApi } from "@/lib/api";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const isAdmin = searchParams.get("type") === "admin";

  const { t, language } = useLanguage();
  const isHi = language === "hi";

  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const minPasswordLength = isAdmin ? 6 : 8;
  const loginHref = isAdmin ? "/admin/login" : "/login";

  // Verify token on initial load
  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      setIsTokenValid(false);
      setTokenError(
        isHi
          ? "पासवर्ड रीसेट लिंक में टोकन अनुपलब्ध है।"
          : "Missing password reset token in the link."
      );
      return;
    }

    let isMounted = true;
    async function verify() {
      try {
        if (isAdmin) {
          await authApi.verifyResetToken(token);
        } else {
          await customerAuthApi.verifyResetToken(token);
        }
        if (isMounted) {
          setIsTokenValid(true);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setIsTokenValid(false);
          const msg = err instanceof Error ? err.message : null;
          setTokenError(
            msg ||
              (isHi
                ? "यह पासवर्ड रीसेट लिंक अमान्य है या समाप्त हो चुका है।"
                : "This password reset link is invalid or has expired.")
          );
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    verify();
    return () => {
      isMounted = false;
    };
  }, [token, isAdmin, isHi]);

  // Handle countdown and redirect after success
  useEffect(() => {
    if (!isSuccess) return;
    if (redirectCountdown <= 0) {
      router.push(loginHref);
      return;
    }

    const timer = setInterval(() => {
      setRedirectCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess, redirectCountdown, router, loginHref]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!password || password.length < minPasswordLength) {
      setSubmitError(
        isHi
          ? `पासवर्ड कम से कम ${minPasswordLength} अक्षरों का होना चाहिए।`
          : `Password must be at least ${minPasswordLength} characters long.`
      );
      return;
    }

    if (password !== confirmPassword) {
      setSubmitError(
        isHi ? "दोनों पासवर्ड एक जैसे होने चाहिए।" : "Passwords do not match."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (isAdmin) {
        await authApi.resetPassword({
          token,
          password,
          confirmPassword,
        });
      } else {
        await customerAuthApi.resetPassword({
          token,
          password,
          confirmPassword,
        });
      }
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : null;
      setSubmitError(
        msg ||
          (isHi
            ? "पासवर्ड अपडेट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।"
            : "Failed to reset password. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Initial Verification Loading
  if (isVerifying) {
    return (
      <div className="mx-auto max-w-md rounded-xs border border-line bg-canvas p-8 text-center shadow-sm">
        <LoadingState
          variant="lines"
          count={2}
          label={t.auth.verifyingLink || (isHi ? "लिंक सत्यापित किया जा रहा है..." : "Verifying reset link...")}
        />
      </div>
    );
  }

  // 2. Invalid or Expired Token View
  if (!isTokenValid) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-xs border border-line bg-canvas p-6 sm:p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
            <LockIcon size={24} />
          </div>
          <h2 className="type-h3 text-ink">
            {t.auth.invalidOrExpiredTokenTitle || (isHi ? "अमान्य या समाप्त लिंक" : "Invalid or Expired Link")}
          </h2>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            {tokenError ||
              (t.auth.invalidOrExpiredTokenDesc ||
                (isHi
                  ? "यह पासवर्ड रीसेट लिंक या तो समाप्त हो चुका है या पहले इस्तेमाल किया जा चुका है।"
                  : "This password reset link is invalid or has expired. Please request a new link."))}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link href={isAdmin ? "/forgot-password?type=admin" : "/forgot-password"}>
              <Button size="md" fullWidth>
                {t.auth.requestNewLink || (isHi ? "नया लिंक मांगें" : "Request New Link")}
              </Button>
            </Link>
            <Link
              href={loginHref}
              className="text-xs font-medium text-muted hover:text-accent hover:underline py-1"
            >
              {t.auth.backToLogin || (isHi ? "लॉगिन पर वापस जाएं" : "Back to Login")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Success State View
  if (isSuccess) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-xs border border-line bg-canvas p-6 sm:p-8 text-center shadow-sm animate-fadeIn">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
            <CheckIcon size={28} />
          </div>
          <h2 className="type-h3 text-ink">
            {t.auth.passwordResetSuccessTitle || (isHi ? "पासवर्ड सफलतापूर्वक बदल गया!" : "Password Reset Successfully!")}
          </h2>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            {t.auth.passwordResetSuccessDesc ||
              (isHi
                ? "अब आप अपने नए पासवर्ड से लॉगिन कर सकते हैं।"
                : "You can now sign in with your new password.")}
          </p>

          <div className="mt-4 rounded-xs bg-canvas-deep p-3 text-xs text-muted">
            {isHi
              ? `${redirectCountdown} सेकंड में लॉगिन पेज पर जा रहे हैं...`
              : `Redirecting to login in ${redirectCountdown} seconds...`}
          </div>

          <div className="mt-6">
            <Link href={loginHref}>
              <Button size="lg" fullWidth>
                {t.auth.btnLogin || (isHi ? "अभी लॉगिन करें" : "Log In Now")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Reset Password Form View
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xs border border-line bg-canvas p-6 sm:p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <LockIcon size={24} />
          </div>
          <h2 className="type-h3 text-ink">
            {t.auth.resetPasswordTitle || (isHi ? "नया पासवर्ड बनाएं" : "Set New Password")}
          </h2>
          <p className="mt-1 text-xs text-muted">
            {t.auth.resetPasswordSubtitle ||
              (isHi
                ? `कृपया अपने अकाउंट के लिए कम से कम ${minPasswordLength} अक्षरों का नया पासवर्ड चुनें।`
                : `Please choose a strong password of at least ${minPasswordLength} characters.`)}
          </p>
        </div>

        {submitError ? (
          <div className="mb-5 rounded-xs border border-danger/30 bg-danger/5 p-3 text-xs text-danger">
            {submitError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="new-password" className="field-label flex items-center gap-1.5">
                <LockIcon size={14} className="text-muted" />
                {t.auth.newPassword || (isHi ? "नया पासवर्ड" : "New Password")} <span className="text-accent">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-[0.6875rem] text-muted hover:text-ink focus:outline-none"
              >
                {showPassword ? (isHi ? "छुपाएं" : "Hide") : (isHi ? "दिखाएं" : "Show")}
              </button>
            </div>
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder={t.auth.newPasswordPlaceholder || (isHi ? `कम से कम ${minPasswordLength} अक्षर` : `At least ${minPasswordLength} characters`)}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setSubmitError(null);
              }}
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="field-label flex items-center gap-1.5">
              <ShieldCheckIcon size={14} className="text-muted" />
              {t.auth.confirmNewPassword || (isHi ? "नए पासवर्ड की पुष्टि करें" : "Confirm New Password")} <span className="text-accent">*</span>
            </label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder={t.auth.confirmNewPasswordPlaceholder || (isHi ? "वही पासवर्ड दोबारा डालें" : "Re-enter new password")}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setSubmitError(null);
              }}
              required
            />
          </div>

          {password && password.length < minPasswordLength ? (
            <p className="text-[0.6875rem] text-alert">
              ⚠️ {isHi ? `पासवर्ड में कम से कम ${minPasswordLength} अक्षर होने चाहिए।` : `Must be at least ${minPasswordLength} characters.`}
            </p>
          ) : null}

          <div className="mt-2">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting
                ? t.auth.btnSettingNewPassword || (isHi ? "पासवर्ड अपडेट हो रहा है..." : "Updating Password...")
                : t.auth.btnSetNewPassword || (isHi ? "पासवर्ड अपडेट करें" : "Update Password")}
            </Button>
          </div>
        </form>

        <div className="mt-6 border-t border-line/60 pt-5 text-center">
          <Link
            href={loginHref}
            className="text-xs font-medium text-muted hover:text-accent hover:underline"
          >
            {t.auth.backToLogin || (isHi ? "लॉगिन पर वापस जाएं" : "Back to Login")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  return (
    <>
      <PageHeader
        eyebrow={isHi ? "सुरक्षा" : "Account Security"}
        title={t.auth.resetPasswordTitle || (isHi ? "नया पासवर्ड बनाएं" : "Set New Password")}
        description={
          t.auth.resetPasswordSubtitle ||
          (isHi
            ? "अपने खाते के लिए नया सुरक्षित पासवर्ड दर्ज करें।"
            : "Enter a strong new password for your account.")
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.auth.loginTitle, href: "/login" },
          { label: t.auth.resetPasswordTitle || (isHi ? "नया पासवर्ड" : "Reset Password") },
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
            <ResetPasswordContent />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
