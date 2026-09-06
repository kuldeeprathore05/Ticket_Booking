import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMovies } from "../services/movieService.js";
import MovieCard from "../components/MovieCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { ArrowRight } from "lucide-react";

const GENRES = ["Action", "Drama", "Comedy", "Sci-Fi", "Fantasy", "Romance", "Thriller"];

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [nowShowing, setNowShowing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    (async () => {
      try {
        const [nowRes, upRes] = await Promise.all([
          fetchMovies({ status: "NOW_SHOWING", limit: 12 }),
          fetchMovies({ status: "UPCOMING", limit: 8 }),
        ]);
        setNowShowing(nowRes.data);
        setUpcoming(upRes.data);
        setFeatured(nowRes.data[0] || null);
        setStatus("ready");
      } catch (e) {
        setStatus("error");
      }
    })();
  }, []);

  if (status === "loading") return <LoadingSpinner label="Loading movies" />;
  if (status === "error") return <div className="mx-auto max-w-7xl px-4 py-16"><ErrorState /></div>;

  return (
    <div>
      {featured && (
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0">
            <img src={featured.banner || featured.poster} alt="" className="h-full w-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/10 via-ink-900/20 to-ink-900/10" />
          </div>
          <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-24 sm:px-6 sm:py-32">
            <p className="text-sm font-medium text-brand-400">Now showing</p>
            <h1 className="max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {featured.title}
            </h1>
            <p className="max-w-lg text-sm text-white/60 sm:text-base">{featured.description}</p>
            <div className="mt-2 flex gap-3">
              <Link
                to={`/movies/${featured._id}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Book tickets <ArrowRight size={16} />
              </Link>
              <Link
                to="/movies"
                className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5"
              >
                Browse all movies
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-5 flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <Link
              key={g}
              to={`/movies?genre=${g}`}
              className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-medium text-white/60 transition hover:border-brand-500/60 hover:text-white"
            >
              {g}
            </Link>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Now showing</h2>
          <Link to="/movies?status=NOW_SHOWING" className="text-sm text-white/40 hover:text-white">See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {nowShowing.map((m) => (
            <MovieCard key={m._id} movie={m} />
          ))}
        </div>

        {upcoming.length > 0 && (
          <>
            <div className="mb-4 mt-12 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Coming soon</h2>
              <Link to="/movies?status=UPCOMING" className="text-sm text-white/40 hover:text-white">See all</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {upcoming.map((m) => (
                <MovieCard key={m._id} movie={m} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
