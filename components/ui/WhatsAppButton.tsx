import { buttonClassName, type ButtonSize } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { IconButton } from "./IconButton";
import { WhatsAppIcon } from "./Icons";

export interface WhatsAppButtonProps {
  /** Pre-filled chat message. Defaults to a general wholesale enquiry. */
  message?: string;
  label?: string;
  /**
   * `primary` / `secondary` / `ghost` / `link` match the Button component.
   * `icon` renders a round icon-only button; `floating` is the fixed mobile shortcut.
   */
  variant?: "primary" | "secondary" | "ghost" | "link" | "icon" | "floating";
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

/**
 * WhatsApp click-to-chat (wa.me) with a pre-filled message.
 * On phones it opens the WhatsApp app; on desktop, WhatsApp Web or Desktop.
 */
export function WhatsAppButton({
  message = defaultWhatsAppMessage,
  label = "Enquire on WhatsApp",
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  onClick,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppUrl(message);

  if (variant === "icon" || variant === "floating") {
    const isFloating = variant === "floating";
    return (
      <IconButton
        href={href}
        external
        label={label}
        icon={<WhatsAppIcon size={isFloating ? 24 : 18} />}
        variant={isFloating ? "solid" : "outline"}
        size={isFloating ? "lg" : "md"}
        onClick={onClick}
        className={cn(isFloating && "safe-bottom fixed right-4 z-30 shadow-lift sm:right-6", className)}
      />
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={buttonClassName({ variant, size, fullWidth, className })}
    >
      <WhatsAppIcon size={size === "sm" ? 16 : 18} />
      {label}
    </a>
  );
}
