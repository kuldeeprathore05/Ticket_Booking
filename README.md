# CineBook — Movie Ticket Booking Platform

A full-stack movie ticket booking platform built with the MERN stack plus Redis, focused on one core technical problem: **temporarily locking seats during checkout so two people can never buy the same seat, without leaving stale locks behind if someone abandons checkout.**

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Why Redis? (seat-lock design)](#why-redis-seat-lock-design)
- [Booking flow](#booking-flow)
- [Database schema](#database-schema)
- [API documentation](#api-documentation)
- [Environment setup](#environment-setup)
- [Local installation](#local-installation)
- [Deployment](#deployment)
- [Project structure](#project-structure)

## Features

- Browse movies with search, genre, language and status filters
- Per-movie show listings grouped by theatre, with a 7-day date picker
- Interactive seat map with four visual states: available, selected, held by someone else, booked
- **5-minute Redis-backed seat reservation** with a live countdown
- Mock payment flow, architected as a drop-in swap for real Razorpay
- QR-coded booking confirmation ("ticket stub") and booking history
- Admin dashboard: movie/theatre/screen/show CRUD, all-bookings table, and revenue/booking analytics via MongoDB aggregation pipelines
- Clerk-based authentication for both the frontend and the API

## Tech stack

**Frontend:** React, Vite, React Router, Tailwind CSS, Redux Toolkit, Axios, Recharts, react-hot-toast, qrcode.react, Clerk React SDK

**Backend:** Node.js, Express, MongoDB (Mongoose), Redis, Clerk Node SDK, express-validator, Razorpay SDK (optional)

## Architecture

```
React (Vite)
     |
     |  REST / JSON, Clerk session JWT on every request
     v
Express API  ---->  MongoDB   (movies, theatres, screens, shows, bookings, users)
     |
     '---------->  Redis      (short-lived seat_lock:{showId}:{seatId} keys only)
```

Redis is used **only** for temporary seat locks — it is never a system of record. Everything that must survive past the checkout window (confirmed bookings, seat inventory, users) lives in MongoDB.

## Why Redis? (seat-lock design)

The hard problem in any ticket-booking system is: what happens to a seat between "I clicked it" and "I paid for it"? If you don't lock it, two people can pay for the same seat. If you lock it in MongoDB, you now need a background job to notice and clean up abandoned locks.

Redis solves this natively with `SET key value NX EX <ttl>`:

- **`NX`** — only set the key if it doesn't already exist, so a second user's attempt to lock an already-held seat fails atomically. No race condition, no separate "check then set".
- **`EX 300`** — the key self-destructs after 5 minutes. If the user closes the tab, loses connection, or just stalls at checkout, the lock disappears on its own and the seat becomes bookable again — no cron job, no manual cleanup.

Key shape used throughout the backend:

```
seat_lock:{showId}:{seatId}  ->  value: <mongoUserId>
```

Right before a booking is confirmed, the backend re-checks that every lock still exists **and** is still owned by the paying user (`services/seatLockService.js#verifyOwnership`). This is what closes the loop on "user's lock expired mid-payment" and "user tampered with the frontend to submit someone else's seats" — both are rejected server-side regardless of what the client sends.

## Booking flow

```
Select movie -> theatre -> show -> seat layout -> select seats
     -> POST /shows/:showId/reserve-seats   (Redis SET NX EX 300 per seat)
     -> Checkout page shows a live countdown driven by the server's expiry
     -> POST /bookings                      (creates a PENDING booking, re-verifies lock ownership)
     -> POST /payments/create                (creates a payment order — mock or Razorpay)
     -> POST /payments/verify
            |
            +-- success --> confirmBooking():
            |                 1. re-verify Redis lock ownership
            |                 2. atomically move seats from Redis -> Show.bookedSeats (conditional update, no double-booking)
            |                 3. mark booking CONFIRMED / PAID
            |                 4. release the Redis locks
            |
            +-- failure / lock expired --> booking marked CANCELLED / FAILED, seats freed
```

### Edge cases handled

| Case | Behavior |
|---|---|
| User B tries a seat User A just locked | `SET NX` fails instantly, seat shown as unavailable |
| User A abandons checkout | Redis TTL expires after 5 min, seat becomes bookable again |
| User A's lock expires *while paying* | Booking confirmation re-checks lock ownership and rejects with "reservation expired" instead of trusting the earlier reservation |
| User tries to book an already-confirmed seat | Rejected both when reserving (checked against `Show.bookedSeats`) and when confirming (conditional Mongo update) |
| Frontend tampers with someone else's reservation | Rejected — Redis lock ownership is checked against the authenticated user's ID, never trusted from the request body |

## Database schema

- **User** — `clerkUserId`, `name`, `email`, `role (USER/ADMIN)`
- **Movie** — `title`, `description`, `poster`, `banner`, `genre[]`, `language`, `duration`, `releaseDate`, `rating`, `cast[]`, `director`, `status`
- **Theatre** — `name`, `location {address, city}`, `screens[]`
- **Screen** — `theatreId`, `name`, `totalSeats`, `seatLayout` (2D array of seat ids)
- **Show** — `movieId`, `theatreId`, `screenId`, `date`, `startTime`, `endTime`, `price`, `bookedSeats[]`
- **Booking** — `userId`, `showId`, `seats[]`, `amount`, `paymentStatus`, `bookingStatus`, `bookingReference`, `paymentOrderId`, `paymentId`
 