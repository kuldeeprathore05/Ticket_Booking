import asyncHandler from "express-async-handler";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import { ApiError } from "../utils/ApiError.js";
import { confirmBooking } from "../services/bookingService.js";
import { releaseSeats} from "../services/seatLockService.js";

const RAZORPAY_ENABLED = Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
);

let razorpayInstance = null;
if (RAZORPAY_ENABLED) { 
  const Razorpay = (await import("razorpay")).default;
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// POST /api/payments/create 
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new ApiError(404, "Booking not found");
  if (booking.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }
  if (booking.bookingStatus !== "PENDING") {
    throw new ApiError(400, "Booking is not in a payable state");
  }

  if (RAZORPAY_ENABLED) {
    const order = await razorpayInstance.orders.create({
      amount: booking.amount * 100, // paise
      currency: "INR",
      receipt: booking.bookingReference,
    });
    booking.paymentOrderId = order.id;
    await booking.save();

    return res.json({
      success: true,
      mock: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  }
 
  const mockOrderId = `mock_order_${booking.bookingReference}`;
  booking.paymentOrderId = mockOrderId;
  await booking.save();

  res.json({
    success: true,
    mock: true,
    orderId: mockOrderId,
    amount: booking.amount * 100,
    currency: "INR",
  });
});

// POST /api/payments/verify ,,, Real mode body: { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } ,,,  Mock mode body: { bookingId, mockOutcome: "success" | "failure" }
export const verifyPayment = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new ApiError(404, "Booking not found");
  if (booking.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }
  if (booking.bookingStatus !== "PENDING") {
    throw new ApiError(400, "Booking is not in a payable state");
  }

  if (RAZORPAY_ENABLED) {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      throw new ApiError(
        400,
        "Incomplete Razorpay payment details"
      );
    }

    if (razorpay_order_id !== booking.paymentOrderId) {
      throw new ApiError(400, "Invalid Razorpay order");
    } 
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      booking.paymentStatus = "FAILED";
      booking.bookingStatus = "CANCELLED";
      await booking.save();
      await releaseSeats(
        booking.showId.toString(),
        booking.seats
      );
      throw new ApiError(400, "Payment verification failed");
    }

    booking.paymentId = razorpay_payment_id;
  } else { 
    const { mockOutcome = "success" } = req.body;
    if (mockOutcome !== "success") {
      booking.paymentStatus = "FAILED";
      booking.bookingStatus = "CANCELLED";
      await booking.save();
      throw new ApiError(400, "Payment failed");
    }
    booking.paymentId = `mock_pay_${booking.bookingReference}`;
  }

  const confirmed = await confirmBooking(booking);

  res.json({ success: true, data: confirmed });
});
