import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export default function SectionCard({
  title,
  subtitle,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`laex-card rounded-3xl p-8 md:p-10 ${className}`}
    >
      <header className="mb-8">
        <h2 className="text-3xl font-black text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-3 max-w-3xl text-slate-400">
            {subtitle}
          </p>
        )}
      </header>

      {children}
    </section>
  );
}
