import { Routes, Route } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setAuthTokenGetter } from "./services/api.js";

import MainLayout from "./layouts/MainLayout.jsx"; 
import ProtectedRoute from "./components/ProtectedRoute.jsx"; 

import Home from "./pages/Home.jsx";
import MoviesList from "./pages/MoviesList.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import SeatSelection from "./pages/SeatSelection.jsx";
import Checkout from "./pages/Checkout.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import NotFound from "./pages/NotFound.jsx";
 

export default function App() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(() => getToken());
  }, [getToken]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MoviesList />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route
          path="/shows/:showId/seats"
          element={
            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:id/confirmation"
          element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
  
    </Routes>
  );
}
