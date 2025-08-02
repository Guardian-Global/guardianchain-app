// components/layout/PageHeader.tsx — Unified Title Section
interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6 animate-slide-up">
      <h1 className="text-3xl font-extrabold text-brand-primary font-brand tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-brand-highlight mt-2 font-medium opacity-80">
          {subtitle}
        </p>
      )}
    </div>
  );
}