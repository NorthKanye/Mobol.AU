import type { Metadata } from "next";
import NotFoundCountdown from "./_not-found/NotFoundCountdown";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] w-full items-center justify-center px-6 py-24">
      <NotFoundCountdown />
    </section>
  );
}
