const app = require("./src/app");
const { env, validateEnv } = require("./src/config/env");
const { connect } = require("./src/db");

async function start() {
  validateEnv();

  await connect();
  console.log("Successfully connected to MongoDB");

  app.listen(env.PORT, () => {
    console.log(`Server app listening on port ${env.PORT}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

module.exports = app;
