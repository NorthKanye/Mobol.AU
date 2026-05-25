"use client";

import { useEffect, useRef, useState } from "react";

export interface PolicyTocSection {
  id: string;
  label: string;
}

interface PolicyTocProps {
  sections: PolicyTocSection[];
}

export default function PolicyToc({ sections }: PolicyTocProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = sectionsRef.current.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (visible.size > 0) {
          const topId = ids.find((id) => visible.has(id));
          if (topId) setActiveId(topId);
        }
      },
      {
        rootMargin: "-96px 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        aria-label="On this page"
        className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 mb-4">
          On this page
        </p>
        <ul className="space-y-2.5 text-[14px]">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={
                    "block border-l-2 transition-colors duration-150 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink " +
                    (isActive
                      ? "border-ink pl-3 text-ink"
                      : "border-transparent pl-3 text-ink-2 hover:text-ink")
                  }
                  aria-current={isActive ? "true" : undefined}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <details className="lg:hidden mb-8 rounded-xl border border-border bg-bg/40 px-4 py-3 [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex items-center justify-between cursor-pointer text-[14px] font-medium text-ink select-none">
          <span>On this page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="h-4 w-4 transition-transform duration-200 [details[open]_&]:rotate-180"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
            />
          </svg>
        </summary>
        <ul className="mt-3 space-y-2 text-[14px] text-ink-body">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block py-1 text-ink-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink rounded-sm"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}
