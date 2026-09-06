import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  const location = useLocation();

  if (!isLoaded) return <LoadingSpinner label="Checking your session" />;
  if (!isSignedIn) return <Navigate to="/" replace state={{ from: location }} />;

  return children;
}
