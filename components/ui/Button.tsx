import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

type NativeButtonProps = ButtonStyleProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonStyleProps> & {
    href?: undefined;
  };

type InternalLinkProps = ButtonStyleProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonStyleProps | "href"> & {
    href: string;
    external?: false;
  };

type ExternalLinkProps = ButtonStyleProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof ButtonStyleProps | "href"> & {
    href: string;
    /** Opens in a new tab with safe `rel` attributes. */
    external: true;
  };

export type ButtonProps = NativeButtonProps | InternalLinkProps | ExternalLinkProps;

export function buttonClassName({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: Pick<ButtonStyleProps, "variant" | "size" | "fullWidth" | "className">): string {
  return cn(
    "btn",
    `btn--${variant}`,
    size === "sm" && "btn--sm",
    size === "lg" && "btn--lg",
    fullWidth && "btn--block",
    className,
  );
}

function splitStyleProps<P extends ButtonStyleProps>(props: P) {
  const { variant, size, fullWidth, leadingIcon, trailingIcon, className, children, ...rest } = props;
  return {
    className: buttonClassName({ variant, size, fullWidth, className }),
    content: (
      <>
        {leadingIcon}
        {children}
        {trailingIcon}
      </>
    ),
    rest,
  };
}

/**
 * Renders a <button>, a Next.js <Link> (when `href` is set) or an external
 * <a> (when `external` is true), all sharing the same visual variants.
 */
export function Button(props: ButtonProps) {
  if (props.href === undefined) {
    const { className, content, rest } = splitStyleProps(props);
    const { type = "button", ...buttonProps } = rest;
    return (
      <button type={type} className={className} {...buttonProps}>
        {content}
      </button>
    );
  }

  if (props.external) {
    const { className, content, rest } = splitStyleProps(props);
    const { external, ...anchorProps } = rest;
    return (
      <a target="_blank" rel="noopener noreferrer" className={className} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { className, content, rest } = splitStyleProps(props);
  const { external, ...linkProps } = rest;
  return (
    <Link className={className} {...linkProps}>
      {content}
    </Link>
  );
}
