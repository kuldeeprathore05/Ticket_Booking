import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { fetchBookingById } from "../services/bookingService.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { CheckCircle2 } from "lucide-react";

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetchBookingById(id)
      .then((res) => {
        setBooking(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading") return <LoadingSpinner label="Loading your ticket" />;
  if (status === "error" || !booking) return <div className="mx-auto max-w-lg px-4 py-16"><ErrorState /></div>;

  const show = booking.showId;
  const movie = show?.movieId;
  const theatre = show?.theatreId;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 size={26} />
        </span>
        <h1 className="font-display text-xl font-semibold">Booking confirmed</h1>
        <p className="text-sm text-white/50">A copy of this ticket is saved in "My bookings".</p>
      </div>

      {/* Ticket stub */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
        <div className="flex items-center gap-4 border-b border-dashed border-white/10 p-5">
          <img src={movie?.poster} alt={movie?.title} className="h-20 w-14 rounded-md object-cover" />
          <div>
            <p className="font-display font-semibold">{movie?.title}</p>
            <p className="text-sm text-white/50">{theatre?.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-5 text-sm">
          <Field label="Date" value={show?.date} />
          <Field label="Time" value={show?.startTime} />
          <Field label="Seats" value={booking.seats.join(", ")} />
          <Field label="Amount" value={`₹${booking.amount}`} />
          <Field label="Payment" value={booking.paymentStatus} />
          <Field label="Status" value={booking.bookingStatus} />
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-dashed border-white/10 p-6">
          <QRCodeSVG value={booking.bookingReference} size={120} bgColor="transparent" fgColor="#ffffff" />
          <p className="font-mono text-sm tracking-widest text-white/70">{booking.bookingReference}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Link to="/bookings" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5">
          View my bookings
        </Link>
        <Link to="/movies" className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
          Book another movie
        </Link>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-white/30">{label}</p>
      <p className="mt-0.5 text-white/85">{value}</p>
    </div>
  );
}
