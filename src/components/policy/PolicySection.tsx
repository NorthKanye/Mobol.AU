import type { ReactNode } from "react";

interface PolicySectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export default function PolicySection({
  id,
  title,
  children,
}: PolicySectionProps) {
  return (
    <section id={id} className="policy-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
