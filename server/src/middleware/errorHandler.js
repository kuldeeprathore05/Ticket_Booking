export const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};
 
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  console.error(err.stack || err.message);
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
