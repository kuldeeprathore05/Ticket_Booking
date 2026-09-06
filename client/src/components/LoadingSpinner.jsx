export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-white/50">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-brand-500" />
      <p className="text-sm">{label}...</p>
    </div>
  );
}
