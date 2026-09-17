import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type IconButtonVariant = "ghost" | "outline" | "solid" | "overlay";
export type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonStyleProps {
  /** Accessible name. Icon-only controls must always have one. */
  label: string;
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Small count shown in the corner, e.g. items in the order list. Hidden when 0. */
  badge?: number;
  className?: string;
}

type NativeIconButtonProps = IconButtonStyleProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof IconButtonStyleProps | "children" | "aria-label"> & {
    href?: undefined;
  };

type LinkIconButtonProps = IconButtonStyleProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof IconButtonStyleProps | "href" | "children" | "aria-label"> & {
    href: string;
    external?: false;
  };

type ExternalIconButtonProps = IconButtonStyleProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof IconButtonStyleProps | "href" | "children" | "aria-label"> & {
    href: string;
    external: true;
  };

export type IconButtonProps = NativeIconButtonProps | LinkIconButtonProps | ExternalIconButtonProps;

export function iconButtonClassName({
  variant = "ghost",
  size = "md",
  className,
}: Pick<IconButtonStyleProps, "variant" | "size" | "className">): string {
  return cn("icon-btn", `icon-btn--${variant}`, size !== "md" && `icon-btn--${size}`, className);
}

function splitStyleProps<P extends IconButtonStyleProps>(props: P) {
  const { label, icon, variant, size, badge, className, ...rest } = props;
  const hasBadge = badge !== undefined && badge > 0;

  return {
    className: iconButtonClassName({ variant, size, className }),
    // The badge is decorative; callers include the count in `label`.
    content: (
      <>
        {icon}
        {hasBadge ? (
          <span className="icon-btn__badge" aria-hidden="true">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </>
    ),
    label,
    rest,
  };
}

/** Icon-only button or link with a required accessible label and optional count badge. */
export function IconButton(props: IconButtonProps) {
  if (props.href === undefined) {
    const { className, content, label, rest } = splitStyleProps(props);
    const { type = "button", ...buttonProps } = rest;
    return (
      <button type={type} aria-label={label} title={label} className={className} {...buttonProps}>
        {content}
      </button>
    );
  }

  if (props.external) {
    const { className, content, label, rest } = splitStyleProps(props);
    const { external, ...anchorProps } = rest;
    return (
      <a target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={className} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { className, content, label, rest } = splitStyleProps(props);
  const { external, ...linkProps } = rest;
  return (
    <Link aria-label={label} title={label} className={className} {...linkProps}>
      {content}
    </Link>
  );
}
