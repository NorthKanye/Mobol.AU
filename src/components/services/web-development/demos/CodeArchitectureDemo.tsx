"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

const codeLines: Array<{ type: string; content: string }> = [
  { type: "import", content: "import { NextResponse } from 'next/server'" },
  { type: "import", content: "import { db } from '@/lib/database'" },
  { type: "empty", content: "" },
  { type: "export", content: "export async function GET(request: Request) {" },
  { type: "code", content: "  const { searchParams } = new URL(request.url)" },
  { type: "code", content: "  const id = searchParams.get('id')" },
  { type: "empty", content: "" },
  { type: "code", content: "  const data = await db.query({" },
  { type: "code", content: "    where: { id }," },
  { type: "code", content: "    include: { relations: true }" },
  { type: "code", content: "  })" },
  { type: "empty", content: "" },
  { type: "return", content: "  return NextResponse.json(data)" },
  { type: "close", content: "}" },
];

type FileTreeNode = {
  name: string;
  type: "folder" | "file";
  open?: boolean;
  active?: boolean;
  children?: FileTreeNode[];
};

const fileTree: FileTreeNode[] = [
  {
    name: "app",
    type: "folder",
    open: true,
    children: [
      {
        name: "api",
        type: "folder",
        open: true,
        children: [{ name: "route.ts", type: "file", active: true }],
      },
      { name: "page.tsx", type: "file" },
      { name: "layout.tsx", type: "file" },
    ],
  },
  {
    name: "components",
    type: "folder",
    children: [{ name: "ui", type: "folder" }],
  },
  {
    name: "lib",
    type: "folder",
    children: [{ name: "database.ts", type: "file" }],
  },
];

function renderFileTree(items: FileTreeNode[], depth = 0): React.ReactElement[] {
  return items.flatMap((item) => {
    const row = (
      <div key={`${depth}-${item.name}`}>
        <div
          className={`flex items-center gap-2 py-1 px-2 rounded ${
            item.type === "file" && item.active
              ? "bg-white/10 text-white"
              : "text-neutral-300"
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {item.type === "folder" ? (
            <svg
              className="w-3.5 h-3.5 text-neutral-500"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5 text-blue-400"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          )}
          <span className="text-[11px] font-mono">{item.name}</span>
        </div>
        {item.children ? renderFileTree(item.children, depth + 1) : null}
      </div>
    );
    return [row];
  });
}

export default function CodeArchitectureDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(codeLines.length);
  const [cursorLine, setCursorLine] = useState(codeLines.length - 1);

  const phases = useMemo<TimelinePhase[]>(() => {
    return [
      ...codeLines.map((_, idx) => ({
        duration: 160,
        tick: () => {
          setVisibleLines(idx + 1);
          setCursorLine(idx);
        },
      })),
      {
        duration: 2400,
        tick: () => {
          setVisibleLines(codeLines.length);
          setCursorLine(codeLines.length - 1);
        },
      },
      {
        duration: 160,
        tick: () => {
          setVisibleLines(0);
          setCursorLine(0);
        },
      },
    ];
  }, []);

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);

  const linesToShow = prefersReducedMotion ? codeLines.length : visibleLines;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated mockup of a code editor revealing a Next.js API route file"
      className="relative w-full max-w-2xl mx-auto"
    >
      <div
        className="rounded-2xl overflow-hidden border border-black/10"
        style={{
          backgroundColor: "#1e1e1e",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          className="flex items-center gap-1 px-4 py-2 border-b"
          style={{ backgroundColor: "#252526", borderColor: "#333" }}
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-t text-[11px] text-white font-mono"
            style={{ backgroundColor: "#1e1e1e" }}
          >
            <svg
              className="w-3.5 h-3.5 text-blue-400"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" />
            </svg>
            route.ts
          </div>
        </div>

        <div className="flex">
          <div
            className="w-44 border-r p-2 hidden md:block"
            style={{ backgroundColor: "#252526", borderColor: "#333" }}
          >
            <div className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider px-2 mb-2 font-mono">
              Explorer
            </div>
            {renderFileTree(fileTree)}
          </div>

          <div className="flex-1 p-4 font-mono text-[12px] overflow-hidden">
            <div className="space-y-0">
              {codeLines.map((line, i) => (
                <div
                  key={i}
                  className="flex transition-opacity duration-150"
                  style={{ opacity: i < linesToShow ? 1 : 0.15 }}
                >
                  <span className="w-7 text-right pr-3 text-neutral-600 select-none">
                    {i + 1}
                  </span>
                  <span
                    className={
                      line.type === "import"
                        ? "text-purple-400"
                        : line.type === "export"
                        ? "text-blue-400"
                        : line.type === "return"
                        ? "text-pink-400"
                        : line.type === "close"
                        ? "text-yellow-400"
                        : "text-neutral-300"
                    }
                  >
                    {line.content || " "}
                    {!prefersReducedMotion &&
                      cursorLine === i &&
                      i < visibleLines && (
                        <motion.span
                          className="inline-block w-[2px] h-3.5 bg-white ml-0.5 align-middle"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.7, repeat: Infinity }}
                        />
                      )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between px-4 py-1 text-white text-[10px] font-mono"
          style={{ backgroundColor: "#007acc" }}
        >
          <div className="flex items-center gap-4">
            <span>TypeScript</span>
            <span>UTF-8</span>
          </div>
          <div>
            Ln {Math.min(cursorLine + 1, codeLines.length)}, Col 1
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-surface px-4 py-2 rounded-full border border-black/[0.07] shadow-sm">
        <span className="text-[10px] text-ink-2 uppercase tracking-[0.18em] font-mono">
          Built with
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-ink flex items-center justify-center text-white text-[8px] font-bold">
            N
          </span>
          <span className="w-5 h-5 rounded bg-[#3178c6] flex items-center justify-center text-white text-[8px] font-bold">
            TS
          </span>
          <span className="w-5 h-5 rounded bg-[#149eca] flex items-center justify-center text-white text-[8px] font-bold">
            R
          </span>
        </div>
      </div>
    </div>
  );
}
