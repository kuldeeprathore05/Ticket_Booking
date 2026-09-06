import asyncHandler from "express-async-handler";
 
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});
