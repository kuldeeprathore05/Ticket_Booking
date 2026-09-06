import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
 
export const requireAuth = ClerkExpressRequireAuth({
  onError: (err, req, res) => {
    res.status(401).json({ success: false, message: "Unauthorized" });
  },
}); 

export const withAuth = ClerkExpressWithAuth();
 
export const attachUser = asyncHandler(async (req, res, next) => {
  const { userId, sessionClaims } = req.auth;
  if (!userId) throw new ApiError(401, "Unauthorized");

  let user = await User.findOne({ clerkUserId: userId });

  if (!user) {
    user = await User.create({
      clerkUserId: userId,
      name: sessionClaims?.name || sessionClaims?.firstName || "User",
      email: sessionClaims?.email || `${userId}@placeholder.local`,
      role: "USER",
    });
  }

  req.user = user;
  next();
});
 
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};
