import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { fetchMovieById, fetchShowsForMovie } from "../services/movieService.js";
import { useDispatch } from "react-redux";
import { startBooking } from "../store/bookingSlice.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { Clock, Star, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const nextSevenDays = () =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();

  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [status, setStatus] = useState("loading");
  const [date, setDate] = useState(nextSevenDays()[0]);

  useEffect(() => {
    setStatus("loading");
    fetchMovieById(id)
      .then((res) => setMovie(res.data))
      .catch(() => setStatus("error"));
  }, [id]);

  useEffect(() => {
    if (!movie) return;
    fetchShowsForMovie(id, { date })
      .then((res) => {
        setTheatres(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [movie, id, date]);

  const onSelectShow = (theatre, show) => {
    if (!isSignedIn) {
      toast("Sign in to book tickets");
      return;
    }
    dispatch(startBooking({ movie, theatre, show: { ...show, theatreId: theatre._id } }));
    navigate(`/shows/${show._id}/seats`);
  };

  if (status === "loading" && !movie) return <LoadingSpinner label="Loading movie" />;
  if (status === "error" && !movie) return <div className="mx-auto max-w-5xl px-4 py-16"><ErrorState /></div>;
  if (!movie) return null;

  return (
    <div>
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0">
          <img src={movie.banner || movie.poster} alt="" className="h-full w-full object-cover-[center_20%] opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/10 via-ink-900/20 to-ink-900/10" />
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-14 sm:flex-row sm:px-6">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-64 w-44 shrink-0 self-center rounded-xl object-cover shadow-2xl sm:self-start"
          />
          <div>
            <h1 className="font-display text-3xl font-semibold">{movie.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/50">
              <span className="flex items-center gap-1 text-amber-400"><Star size={14} className="fill-current" /> {movie.rating?.toFixed(1)}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {movie.duration} min</span>
              <span>·</span>
              <span>{movie.language}</span>
              <span>·</span>
              <span>{movie.genre?.join(", ")}</span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">{movie.description}</p>
            <p className="mt-4 text-sm text-white/40">
              <span className="text-white/60">Director:</span> {movie.director}
            </p>
            <p className="text-sm text-white/40">
              <span className="text-white/60">Cast:</span> {movie.cast?.join(", ")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h2 className="mb-4 font-display text-xl font-semibold">Select a show</h2>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {nextSevenDays().map((d) => {
            const label = new Date(d).toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
            return (
              <button
                key={d}
                onClick={() => setDate(d)}
                className={`flex shrink-0 flex-col items-center gap-0.5 rounded-lg border px-4 py-2 text-sm transition ${
                  date === d
                    ? "border-brand-500 bg-brand-500/15 text-white"
                    : "border-white/10 text-white/50 hover:border-white/20"
                }`}
              >
                <Calendar size={13} className="mb-0.5 opacity-50" />
                {label}
              </button>
            );
          })}
        </div>

        {status === "loading" && <LoadingSpinner label="Loading shows" />}

        {status === "ready" && theatres.length === 0 && (
          <EmptyState title="No shows on this date" description="Try a different date." />
        )}

        <div className="flex flex-col gap-4">
          {theatres.map(({ theatre, shows }) => (
            <div key={theatre._id} className="rounded-xl border border-white/10 bg-ink-800 p-4">
              <p className="font-medium">{theatre.name}</p>
              <p className="text-xs text-white/40">{theatre.location?.address}, {theatre.location?.city}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {shows.map((show) => (
                  <button
                    key={show._id}
                    onClick={() => onSelectShow(theatre, show)}
                    className="rounded-lg border border-white/10 px-3.5 py-2 text-sm font-medium text-white/70 transition hover:border-brand-500 hover:text-white"
                  >
                    {show.startTime}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
