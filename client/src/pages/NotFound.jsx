import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-4 py-32 text-center">
      <p className="font-display text-5xl font-semibold text-white/20">404</p>
      <p className="text-white/60">This page doesn't exist.</p>
      <Link to="/" className="mt-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white">
        Back to home
      </Link>
    </div>
  );
}
