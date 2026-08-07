const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");
const { AppError } = require("./utils/app-error");
const { securityHeaders } = require("./middleware/security-headers");
const { notFoundHandler, errorHandler } = require("./middleware/error-handler");
const { success } = require("./utils/api-response");
const { asyncHandler } = require("./middleware/async-handler");
const { topSpecialists } = require("./controllers/doctor.controller");
const healthRoutes = require("./routes/health.routes");
const doctorRoutes = require("./routes/doctor.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new AppError("Not allowed by CORS", 403));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(securityHeaders);

app.get("/", (req, res) => {
  return success(res, { message: "Hello World!" });
});

app.get("/topSpecialists", asyncHandler(topSpecialists));

app.use("/health", healthRoutes);
app.use("/doctors", doctorRoutes);
app.use("/booking", bookingRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
