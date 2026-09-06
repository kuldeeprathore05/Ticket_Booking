export default function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-brand-900/40 bg-brand-900/10 py-16 text-center">
      <p className="font-display text-base font-semibold text-brand-400">Couldn't load this</p>
      <p className="max-w-sm text-sm text-white/50">{message}</p>
    </div>
  );
}
