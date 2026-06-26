export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-500">{eyebrow}</p> : null}
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
