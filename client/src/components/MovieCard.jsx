import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group relative block overflow-hidden rounded-xl bg-ink-800 ring-1 ring-white/5 transition hover:ring-brand-500/60"
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-ink-700">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900 via-ink-900/80 to-transparent p-3 pt-8">
        <p className="line-clamp-1 font-display text-sm font-semibold text-white">{movie.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-white/50">
          <span className="flex items-center gap-1 text-amber-400">
            <Star size={12} className="fill-current" /> {movie.rating?.toFixed(1) || "—"}
          </span>
          <span>·</span>
          <span>{movie.language}</span>
        </div>
      </div>
      {movie.status === "UPCOMING" && (
        <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink-900">
          Upcoming
        </span>
      )}
    </Link>
  );
}
