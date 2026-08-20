export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : err.message,
  });
};
