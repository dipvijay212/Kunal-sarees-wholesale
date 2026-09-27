"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SparkleIcon } from "@/components/ui/Icons";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const { t, language } = useLanguage();
  const isHi = language === "hi";

  useEffect(() => {
    // Replace with an error reporting service when one is configured.
    console.error(error);
  }, [error]);

  return (
    <section className="section-y">
      <div className="container-page">
        <EmptyState
          icon={<SparkleIcon size={26} />}
          title={isHi ? "कुछ समस्या हो गई" : "Something Went Wrong"}
          description={
            isHi
              ? "यह पेज लोड नहीं हो सका। कृपया दोबारा कोशिश करें या कैटलॉग पर जाएं।"
              : "Unable to load this page. Please try again or return to the catalog."
          }
          action={
            <>
              <Button onClick={() => retry()}>{isHi ? "दोबारा कोशिश करें" : "Try Again"}</Button>
              <Button href="/products" variant="secondary">
                {t.products.viewAllFull}
              </Button>
            </>
          }
        />
      </div>
    </section>
  );
}

