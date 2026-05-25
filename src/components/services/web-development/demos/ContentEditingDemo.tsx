"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

type EditField = "headline" | "copy" | "photo" | "hours";

type EditStep = {
  field: EditField;
  label: string;
  fieldValue: string;
  heading: string;
  body: string;
  hours: string;
  imageLabel: string;
  imageBg: string;
  imageMark: string;
};

const editSteps: EditStep[] = [
  {
    field: "headline",
    label: "Homepage headline",
    fieldValue: "Book trusted repairs online",
    heading: "Book trusted repairs online",
    body: "Fast turnarounds for phones, laptops, and tablets across Perth.",
    hours: "Mon-Fri, 8am-5pm",
    imageLabel: "Device repairs",
    imageBg: "#f1f5f9",
    imageMark: "#0f172a",
  },
  {
    field: "copy",
    label: "Service intro",
    fieldValue: "Clear pricing before we start",
    heading: "Book trusted repairs online",
    body: "Clear pricing before we start, friendly support, and updates by SMS.",
    hours: "Mon-Fri, 8am-5pm",
    imageLabel: "Device repairs",
    imageBg: "#eef2ff",
    imageMark: "#3730a3",
  },
  {
    field: "photo",
    label: "Feature image",
    fieldValue: "Workshop photo updated",
    heading: "Book trusted repairs online",
    body: "Clear pricing before we start, friendly support, and updates by SMS.",
    hours: "Mon-Fri, 8am-5pm",
    imageLabel: "Workshop",
    imageBg: "#ecfdf5",
    imageMark: "#047857",
  },
  {
    field: "hours",
    label: "Opening hours",
    fieldValue: "Sat bookings now open",
    heading: "Book trusted repairs online",
    body: "Clear pricing before we start, friendly support, and updates by SMS.",
    hours: "Mon-Sat, 8am-5pm",
    imageLabel: "Workshop",
    imageBg: "#fff7ed",
    imageMark: "#c2410c",
  },
];

const fieldLabels: Record<EditField, string> = {
  headline: "Headline",
  copy: "Intro text",
  photo: "Photo",
  hours: "Hours",
};

export default function ContentEditingDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [saving, setSaving] = useState(true);

  const phases = useMemo<TimelinePhase[]>(
    () =>
      editSteps.flatMap((_, idx) => [
        {
          duration: 850,
          tick: () => {
            setActiveIdx(idx);
            setSaving(true);
          },
        },
        {
          duration: 1900,
          tick: () => setSaving(false),
        },
      ]),
    []
  );

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);

  const step = prefersReducedMotion
    ? editSteps[editSteps.length - 1]
    : editSteps[activeIdx];
  const displaySaving = prefersReducedMotion ? false : saving;
  const displayPublished =
    prefersReducedMotion ||
    (!displaySaving && activeIdx === editSteps.length - 1);
  const statusLabel = displaySaving
    ? "Saving"
    : displayPublished
    ? "Published"
    : "Saved";

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated website editor showing a business owner updating headline, intro text, photo, and opening hours, then publishing the site."
      className="relative w-full max-w-xl mx-auto"
    >
      <div
        className="h-[454px] sm:h-[392px] rounded-2xl border border-black/[0.07] bg-surface p-3 sm:p-4 overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="grid h-full grid-rows-[132px_1fr] sm:grid-rows-1 sm:grid-cols-[184px_1fr] gap-3 sm:gap-4">
          <div className="rounded-xl border border-black/[0.06] bg-[#f7f7f7] p-3 overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-3">
                  Site editor
                </div>
                <div className="mt-1 text-[13px] font-medium text-ink">
                  Home page
                </div>
              </div>
              <motion.div
                key={statusLabel}
                className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                  displayPublished
                    ? "bg-ink text-white"
                    : "bg-surface text-ink-2 border border-black/[0.06]"
                }`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {statusLabel}
              </motion.div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-1">
              {(Object.keys(fieldLabels) as EditField[]).map((field) => (
                <div
                  key={field}
                  className={`rounded-lg border px-2.5 py-2 transition-colors ${
                    step.field === field
                      ? "border-black/[0.12] bg-surface"
                      : "border-transparent bg-transparent"
                  }`}
                >
                  <div className="text-[9px] font-mono uppercase tracking-[0.14em] text-ink-3">
                    {fieldLabels[field]}
                  </div>
                  <div className="mt-1 truncate text-[11px] text-ink-2">
                    {step.field === field ? step.fieldValue : "Ready to edit"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl border border-black/[0.06] bg-white overflow-hidden">
            <div className="flex items-center gap-2 border-b border-black/[0.05] bg-[#f5f5f5] px-3 py-2">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto rounded-full bg-surface px-3 py-0.5 text-[10px] font-mono text-ink-3">
                live preview
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-5 w-16 rounded-md bg-ink" />
                <div className="flex gap-2">
                  <span className="h-1.5 w-8 rounded-full bg-[#dedede]" />
                  <span className="h-1.5 w-8 rounded-full bg-[#dedede]" />
                  <span className="h-1.5 w-8 rounded-full bg-[#dedede]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_136px] gap-4 sm:gap-5">
                <div>
                  <motion.p
                    key={`${step.field}-eyebrow`}
                    className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-3"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    Perth repairs
                  </motion.p>
                  <motion.h3
                    key={step.heading}
                    className="mt-2 text-[24px] sm:text-[28px] font-semibold leading-[1.05] tracking-display text-ink"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.heading}
                  </motion.h3>
                  <motion.p
                    key={step.body}
                    className="mt-3 max-w-[260px] text-[12px] leading-[1.55] text-ink-body"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.04 }}
                  >
                    {step.body}
                  </motion.p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-medium text-white">
                      Book now
                    </span>
                    <motion.span
                      key={step.hours}
                      className="rounded-full bg-[#f5f5f5] px-3 py-1.5 text-[11px] text-ink-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      {step.hours}
                    </motion.span>
                  </div>
                </div>

                <motion.div
                  key={step.imageLabel}
                  className="hidden sm:flex h-[178px] flex-col justify-between rounded-xl p-3"
                  style={{ backgroundColor: step.imageBg }}
                  initial={{ opacity: 0.65, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <div
                    className="h-9 w-9 rounded-lg"
                    style={{ backgroundColor: step.imageMark }}
                  />
                  <div>
                    <div
                      className="mb-2 h-2 w-20 rounded-full"
                      style={{ backgroundColor: step.imageMark, opacity: 0.22 }}
                    />
                    <div
                      className="h-2 w-14 rounded-full"
                      style={{ backgroundColor: step.imageMark, opacity: 0.16 }}
                    />
                    <div className="mt-3 text-[11px] font-medium text-ink">
                      {step.imageLabel}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!prefersReducedMotion && (
        <motion.div
          className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-black/[0.07] bg-surface px-3 py-1.5 shadow-sm"
          animate={{ y: displaySaving ? 0 : -2 }}
          transition={{ duration: 0.35 }}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              displaySaving ? "bg-[#f59e0b]" : "bg-[#22c55e]"
            }`}
          />
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-2">
            {displaySaving ? `Editing ${step.label}` : statusLabel}
          </span>
        </motion.div>
      )}
    </div>
  );
}
