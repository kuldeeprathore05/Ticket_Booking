import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyBookings } from "../services/bookingService.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";

const STATUS_STYLE = {
  CONFIRMED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  PENDING: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  CANCELLED: "text-white/40 bg-white/5 border-white/10",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetchMyBookings()
      .then((res) => {
        setBookings(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return <LoadingSpinner label="Loading your bookings" />;
  if (status === "error") return <div className="mx-auto max-w-3xl px-4 py-16"><ErrorState /></div>;

  const now = Date.now();
  const upcoming = bookings.filter((b) => b.bookingStatus === "CONFIRMED" && new Date(`${b.showId?.date}T${b.showId?.startTime}`) >= now);
  const past = bookings.filter((b) => !upcoming.includes(b));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold">My bookings</h1>

      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Once you book a show, it will show up here."
          action={<Link to="/movies" className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white">Browse movies</Link>}
        />
      ) : (
        <div className="flex flex-col gap-8">
          {upcoming.length > 0 && <Section title="Upcoming" bookings={upcoming} />}
          {past.length > 0 && <Section title="Past & other bookings" bookings={past} />}
        </div>
      )}
    </div>
  );
}

function Section({ title, bookings }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-white/40">{title}</h2>
      <div className="flex flex-col gap-3">
        {bookings.map((b) => (
          <Link
            key={b._id}
            to={`/bookings/${b._id}/confirmation`}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-ink-800 p-4 transition hover:border-white/20"
          >
            <img src={b.showId?.movieId?.poster} alt="" className="h-16 w-11 rounded-md object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{b.showId?.movieId?.title}</p>
              <p className="text-xs text-white/40">
                {b.showId?.theatreId?.name} · {b.showId?.date} · {b.showId?.startTime}
              </p>
              <p className="text-xs text-white/40">Seats: {b.seats.join(", ")}</p>
            </div>
            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[b.bookingStatus]}`}>
              {b.bookingStatus}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
