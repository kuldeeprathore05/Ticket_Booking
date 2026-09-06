import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createBooking } from "../services/bookingService.js";
import { createPaymentOrder, verifyPayment } from "../services/paymentService.js";
import { setBooking, resetBooking } from "../store/bookingSlice.js";
import CountdownBadge from "../components/CountdownBadge.jsx";
import { CreditCard } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movie, theatre, show, selectedSeats, reservationExpiresAt } = useSelector((s) => s.booking);
  const [processing, setProcessing] = useState(false);

  if (!show || selectedSeats.length === 0) {
    navigate("/movies", { replace: true });
    return null;
  }

  const total = selectedSeats.length * show.price;

  const onExpire = () => {
    toast.error("Your seat reservation expired. Please select seats again.");
    navigate(`/shows/${show._id}/seats`, { replace: true });
  };

  const onPay = async () => {
    setProcessing(true);
    try {
      const bookingRes = await createBooking(show._id, selectedSeats);
      const booking = bookingRes.data;
      dispatch(setBooking({ bookingId: booking._id, bookingReference: booking.bookingReference }));

      const orderRes = await createPaymentOrder(booking._id);

      // Mock payment: in real Razorpay mode this would open the Razorpay
      // checkout widget using orderRes.orderId / keyId instead.
      if (orderRes.mock) {
        await new Promise((r) => setTimeout(r, 900)); // simulate gateway round-trip
      }

      const verifyRes = await verifyPayment({
        bookingId: booking._id,
        mockOutcome: "success",
      });

      toast.success("Payment successful!");
      dispatch(resetBooking());
      navigate(`/bookings/${verifyRes.data._id}/confirmation`, { replace: true });
    } catch (e) {
      const message = e?.response?.data?.message || "Payment failed. Please try again.";
      toast.error(message);
      if (e?.response?.status === 410) {
        navigate(`/shows/${show._id}/seats`, { replace: true });
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-xl font-semibold">Checkout</h1>

      {reservationExpiresAt && (
        <div className="mb-6">
          <CountdownBadge deadline={reservationExpiresAt} onExpire={onExpire} />
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
        <div className="flex gap-4">
          <img src={movie?.poster} alt={movie?.title} className="h-24 w-16 rounded-lg object-cover" />
          <div>
            <p className="font-display font-semibold">{movie?.title}</p>
            <p className="text-sm text-white/50">{theatre?.name}</p>
            <p className="text-sm text-white/50">{show?.date} · {show?.startTime}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm">
          <Row label="Seats" value={selectedSeats.join(", ")} />
          <Row label={`Price × ${selectedSeats.length}`} value={`₹${show.price} each`} />
          <Row label="Total amount" value={`₹${total}`} strong />
        </div>

        <button
          onClick={onPay}
          disabled={processing}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          <CreditCard size={16} />
          {processing ? "Processing payment..." : `Pay ₹${total}`}
        </button>
        <p className="mt-3 text-center text-xs text-white/30">
          Sandbox payment - no real charge is made.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/50">{label}</span>
      <span className={strong ? "font-display text-base font-semibold text-white" : "text-white/80"}>{value}</span>
    </div>
  );
}
