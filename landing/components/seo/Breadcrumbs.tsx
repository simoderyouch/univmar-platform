"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { localePath } from "@/lib/site";
import type { Locale } from "@/lib/site";

type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const params = useParams();
  const lang = (params.lang as Locale) ?? "fr";

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-muted-foreground/50">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href.startsWith("/") ? localePath(lang, item.href) : item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
