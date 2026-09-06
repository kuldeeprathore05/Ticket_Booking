export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 py-20 text-center">
      <p className="font-display text-lg font-semibold text-white/80">{title}</p>
      {description && <p className="max-w-sm text-sm text-white/40">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
