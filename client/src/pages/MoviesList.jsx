import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMovies } from "../services/movieService.js";
import MovieCard from "../components/MovieCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";

const LANGUAGES = ["English", "Hindi", "Spanish", "Tamil", "Korean"];

export default function MoviesList() {
  const [params, setParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("loading");

  const search = params.get("search") || "";
  const genre = params.get("genre") || "";
  const language = params.get("language") || "";
  const movieStatus = params.get("status") || "";

  useEffect(() => {
    setStatus("loading");
    fetchMovies({ search, genre, language, status: movieStatus })
      .then((res) => {
        setMovies(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [search, genre, language, movieStatus]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold">
        {search ? `Results for "${search}"` : "All movies"}
      </h1>

      <div className="mt-5 flex flex-wrap gap-3">
        <select
          value={movieStatus}
          onChange={(e) => setFilter("status", e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
        >
          <option value="">Any status</option>
          <option value="NOW_SHOWING">Now showing</option>
          <option value="UPCOMING">Upcoming</option>
        </select>
        <select
          value={language}
          onChange={(e) => setFilter("language", e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
        >
          <option value="">Any language</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        {genre && (
          <button
            onClick={() => setFilter("genre", "")}
            className="rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-2 text-sm text-brand-400"
          >
            Genre: {genre} ✕
          </button>
        )}
      </div>

      <div className="mt-8">
        {status === "loading" && <LoadingSpinner label="Loading movies" />}
        {status === "error" && <ErrorState />}
        {status === "ready" && movies.length === 0 && (
          <EmptyState title="No movies found" description="Try a different search or filter." />
        )}
        {status === "ready" && movies.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((m) => (
              <MovieCard key={m._id} movie={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
