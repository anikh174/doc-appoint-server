const { AppError } = require("../utils/app-error");
const { env } = require("../config/env");

function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || "Internal server error";

  if (err instanceof AppError) {
    return res.status(status).json({
      success: false,
      error: {
        message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  if (err.name === "BSONError" || err.message?.includes("ObjectId")) {
    status = 400;
    message = "Invalid id format";
  }

  if (status >= 500) {
    console.error("[Unhandled error]", err);
  }

  return res.status(status).json({
    success: false,
    error: {
      message:
        status >= 500 && env.NODE_ENV === "production"
          ? "Internal server error"
          : message,
    },
  });
}

module.exports = { notFoundHandler, errorHandler };
