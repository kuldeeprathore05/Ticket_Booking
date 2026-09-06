import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { fetchShowSeats, reserveSeats } from "../services/showService.js";
import { toggleSeat, setReservation } from "../store/bookingSlice.js";
import SeatMap from "../components/SeatMap.jsx";
import CountdownBadge from "../components/CountdownBadge.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorState from "../components/ErrorState.jsx";

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { movie, theatre, show, selectedSeats, reservationExpiresAt } = useSelector((s) => s.booking);

  const [layout, setLayout] = useState(null);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState("loading");
  const [reserving, setReserving] = useState(false);

  const loadSeats = useCallback(() => {
    fetchShowSeats(showId)
      .then((res) => {
        setLayout(res.data.layout);
        setPrice(res.data.price);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [showId]);

  useEffect(() => {
    if (!show || show._id !== showId) {
      // Booking wasn't started via the movie details flow (e.g. page refresh) -
      // send the user back rather than showing a broken seat map.
      navigate("/movies", { replace: true });
      return;
    }
    loadSeats();
    const interval = setInterval(loadSeats, 60000); // keep other users' locks in view
    return () => clearInterval(interval);
  }, [show, showId, loadSeats, navigate]);

  const onToggleSeat = (seatId) => {
    if (reservationExpiresAt) {
      toast.error("You already reserved seats - proceed to checkout or start over.");
      return;
    }
    dispatch(toggleSeat(seatId));
  };

  const onReserve = async () => {
    if (selectedSeats.length === 0) return;
    setReserving(true);
    try {
      const res = await reserveSeats(showId, selectedSeats);
      dispatch(setReservation({ expiresIn: res.expiresIn }));
      toast.success("Seats reserved for 5 minutes");
      navigate("/checkout");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Those seats just became unavailable");
      loadSeats();
    } finally {
      setReserving(false);
    }
  };

  if (status === "loading") return <LoadingSpinner label="Loading seat map" />;
  if (status === "error") return <div className="mx-auto max-w-4xl px-4 py-16"><ErrorState /></div>;

  const total = selectedSeats.length * price;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold">{movie?.title}</h1>
        <p className="text-sm text-white/40">
          {theatre?.name} · {show?.date} · {show?.startTime}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-800 p-6 sm:p-10">
        <SeatMap layout={layout} selectedSeats={selectedSeats} onToggleSeat={onToggleSeat} />
      </div>

      <div className="sticky bottom-0 mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-800/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white/50">
            Selected seats: <span className="text-white">{selectedSeats.join(", ") || "None"}</span>
          </p>
          <p className="font-display text-lg font-semibold">Total: ₹{total}</p>
        </div>
        <button
          onClick={onReserve}
          disabled={selectedSeats.length === 0 || reserving}
          className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {reserving ? "Reserving..." : "Reserve & continue"}
        </button>
      </div>
    </div>
  );
}
