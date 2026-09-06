export default function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink-800 p-5">
      <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold ${accent || "text-white"}`}>{value}</p>
    </div>
  );
}
