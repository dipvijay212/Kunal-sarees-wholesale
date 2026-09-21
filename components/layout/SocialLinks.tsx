import type { ComponentType } from "react";
import { IconButton, type IconButtonSize, type IconButtonVariant } from "@/components/ui/IconButton";
import { FacebookIcon, InstagramIcon, YouTubeIcon, type IconProps } from "@/components/ui/Icons";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/cn";
import type { SocialPlatform } from "@/types";

const platformIcons: Record<SocialPlatform, ComponentType<IconProps>> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
};

interface SocialLinksProps {
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  className?: string;
  itemClassName?: string;
}

export function SocialLinks({ size = "md", variant = "outline", className, itemClassName }: SocialLinksProps) {
  if (siteConfig.social.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Social media">
      {siteConfig.social.map((link) => {
        const Icon = platformIcons[link.platform];
        return (
          <li key={link.platform}>
            <IconButton
              href={link.href}
              external
              label={`${siteConfig.name} on ${link.label}`}
              icon={<Icon size={size === "sm" ? 16 : 18} />}
              variant={variant}
              size={size}
              className={itemClassName}
            />
          </li>
        );
      })}
    </ul>
  );
}

