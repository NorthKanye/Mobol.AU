type Props = {
  variant: "primary" | "secondary";
  label: string;
  description: string;
};

export default function ServiceCard({ variant, label, description }: Props) {
  const isPrimary = variant === "primary";
  return (
    <div>
      <div
        className={`w-full rounded-2xl bg-bg border border-black/[0.04] ${
          isPrimary ? "aspect-square" : "aspect-[4/3]"
        }`}
        aria-hidden="true"
      />
      <h4
        className={`mt-5 text-ink font-medium tracking-[-0.01em] ${
          isPrimary ? "text-[18px]" : "text-[15px]"
        }`}
      >
        {label}
      </h4>
      <p
        className={`mt-2 leading-[1.55] text-ink-2 ${
          isPrimary ? "text-[14px]" : "text-[13px]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
