import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { createApp } from "./app.js";

const startServer = async () => {
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Customy API running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start Customy API:", error);
  process.exit(1);
});
