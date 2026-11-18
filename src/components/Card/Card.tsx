"use client";

import type { ReactNode, HTMLAttributes, MouseEvent } from "react";
import { cx } from "@/utils";
import styles from "./Card.module.css";

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Makes the card hoverable and clickable. */
  interactive?: boolean;
  /** Optional click handler. Implies `interactive={true}`. */
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export function Card({
  children,
  interactive = false,
  onClick,
  className,
  ...rest
}: CardProps) {
  const isInteractive = interactive || Boolean(onClick);

  return (
    <div
      className={cx(
        styles.card,
        isInteractive && styles.interactive,
        className,
      )}
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive && !rest.tabIndex ? 0 : rest.tabIndex}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.(e as unknown as MouseEvent<HTMLDivElement>);
        }
        rest.onKeyDown?.(e);
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardMedia                                                           */
/* ------------------------------------------------------------------ */

export interface CardMediaProps {
  /** The image source URL */
  src?: string;
  /** Alt text for accessibility (required if using an img) */
  alt?: string;
  /** Aspect ratio for the media container (default is 16/9) */
  aspectRatio?: string | number;
  /** Custom content to render instead of an image (e.g., next/image, a video, or iframe) */
  children?: ReactNode;
  className?: string;
}

export function CardMedia({
  src,
  alt = "",
  aspectRatio = "16/9",
  children,
  className,
}: CardMediaProps) {
  return (
    <div 
      className={cx(styles.media, className)} 
      style={{ aspectRatio }}
    >
      {children ? (
        children
      ) : src ? (
        <img
          src={src}
          alt={alt}
          className={styles.mediaImage}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardHeader                                                          */
/* ------------------------------------------------------------------ */

export interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: CardHeaderProps) {
  return (
    <div className={cx(styles.header, className)}>
      <div>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBody                                                            */
/* ------------------------------------------------------------------ */

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.body, className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* CardFooter                                                          */
/* ------------------------------------------------------------------ */

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.footer, className)}>{children}</div>;
}