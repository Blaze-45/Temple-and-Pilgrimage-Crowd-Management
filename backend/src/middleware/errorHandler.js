function errorHandler(err, req, res, next) {
  console.error("ERROR:", err.message);

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
}

module.exports = errorHandler;
