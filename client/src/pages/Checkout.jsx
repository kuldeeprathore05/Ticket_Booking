import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createBooking,cancelBooking } from "../services/bookingService.js";
import {
  createPaymentOrder,
  verifyPayment,
} from "../services/paymentService.js";
import { setBooking, resetBooking } from "../store/bookingSlice.js";
import CountdownBadge from "../components/CountdownBadge.jsx";
import { CreditCard } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    movie,
    theatre,
    show,
    selectedSeats,
    reservationExpiresAt,
  } = useSelector((s) => s.booking);

  const [processing, setProcessing] = useState(false);

  if (!show || !selectedSeats?.length) {
    navigate("/movies", { replace: true });
    return null;
  }

  const total = selectedSeats.length * show.price;

  const onExpire = () => {
    toast.error(
      "Your seat reservation expired. Please select seats again."
    );

    navigate(`/shows/${show._id}/seats`, {
      replace: true,
    });
  };

  const onPay = async () => {
    if (processing) return;

    setProcessing(true);

    try {
      // --------------------------------------------------
      // 1. Create booking
      // --------------------------------------------------
      const bookingRes = await createBooking(
        show._id,
        selectedSeats
      );

      // Support either axios response or response.data
      const booking = bookingRes?.data ?? bookingRes;

      if (!booking?._id) {
        throw new Error("Booking creation failed.");
      }

      dispatch(
        setBooking({
          bookingId: booking._id,
          bookingReference: booking.bookingReference,
        })
      );

      // --------------------------------------------------
      // 2. Create Razorpay order on backend
      // --------------------------------------------------
      const orderRes = await createPaymentOrder(booking._id);

      // Support both:
      // { orderId, amount, ... }
      // and
      // { data: { orderId, amount, ... } }
      const orderData = orderRes?.data ?? orderRes;

      const {
        orderId,
        amount,
        currency,
        keyId,
      } = orderData;

      if (!orderId) {
        throw new Error("Razorpay order ID was not received.");
      }

      if (!keyId) {
        throw new Error("Razorpay Key ID was not received.");
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout failed to load. Please refresh the page."
        );
      }

      // --------------------------------------------------
      // 3. Open Razorpay Checkout
      // --------------------------------------------------
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Movie Ticket Booking",
        description: movie?.title
          ? `Movie ticket booking - ${movie.title}`
          : "Movie ticket booking",

        order_id: orderId,

        theme: {
          color: "#7c3aed",
        },

        handler: async function (response) {
          try {
            // --------------------------------------------------
            // 4. Verify payment on backend
            // --------------------------------------------------
            const verifyRes = await verifyPayment({
              bookingId: booking._id,
              razorpay_order_id:
                response.razorpay_order_id,
              razorpay_payment_id:
                response.razorpay_payment_id,
              razorpay_signature:
                response.razorpay_signature,
            });

            const verifiedBooking =
              verifyRes?.data ?? verifyRes;

            toast.success("Payment successful!");

            dispatch(resetBooking());

            navigate(
              `/bookings/${verifiedBooking._id}/confirmation`,
              {
                replace: true,
              }
            );
          } catch (e) {
            console.error(
              "Payment verification error:",
              e
            );

            const message =
              e?.response?.data?.message ||
              "Payment verification failed.";

            toast.error(message);
          } finally {
            setProcessing(false);
          }
        },

        modal: {
          ondismiss: async function () {
            try {
              await cancelBooking(booking._id);
              toast("Payment cancelled. Seat released.");
            } catch (error) {
              console.error(
                "Failed to cancel booking:",
                error
              );
              toast.error(
                "Payment cancelled, but seat release failed."
              );
            } finally {
              setProcessing(false);
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      // --------------------------------------------------
      // Payment failed before handler()
      // --------------------------------------------------
      razorpay.on(
        "payment.failed",
        async function (response) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          try {
            await cancelBooking(booking._id);
          } catch (error) {
            console.error(
              "Failed to cancel booking:",
              error
            );
          }

          toast.error(
            response?.error?.description ||
              "Payment failed. Seat released."
          );

          setProcessing(false);

        }
      );

      razorpay.open();
    } catch (e) {
      console.error("Payment initiation error:", e);

      const message =
        e?.response?.data?.message ||
        e?.message ||
        "Unable to initiate payment.";

      toast.error(message);

      if (e?.response?.status === 410) {
        navigate(`/shows/${show._id}/seats`, {
          replace: true,
        });
      }

      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-xl font-semibold">
        Checkout
      </h1>

      {reservationExpiresAt && (
        <div className="mb-6">
          <CountdownBadge
            deadline={reservationExpiresAt}
            onExpire={onExpire}
          />
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
        <div className="flex gap-4">
          <img
            src={movie?.poster}
            alt={movie?.title}
            className="h-24 w-16 rounded-lg object-cover"
          />

          <div>
            <p className="font-display font-semibold">
              {movie?.title}
            </p>

            <p className="text-sm text-white/50">
              {theatre?.name}
            </p>

            <p className="text-sm text-white/50">
              {show?.date} · {show?.startTime}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm">
          <Row
            label="Seats"
            value={selectedSeats.join(", ")}
          />

          <Row
            label={`Price × ${selectedSeats.length}`}
            value={`₹${show.price} each`}
          />

          <Row
            label="Total amount"
            value={`₹${total}`}
            strong
          />
        </div>

        <button
          onClick={onPay}
          disabled={processing}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          <CreditCard size={16} />

          {processing
            ? "Opening payment..."
            : `Pay ₹${total}`}
        </button>

        <p className="mt-3 text-center text-xs text-white/30">
          Razorpay Test Mode - no real charge is made.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/50">{label}</span>

      <span
        className={
          strong
            ? "font-display text-base font-semibold text-white"
            : "text-white/80"
        }
      >
        {value}
      </span>
    </div>
  );
}