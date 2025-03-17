import "reflect-metadata";
import { env } from "./common/utils/env.config";
import app from "./app";
import { initializeDatabaseConnection } from "./database/database";

const main = async () => {
  try {
    await initializeDatabaseConnection();

    app.listen(env.PORT, async () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.log("Failed to run server, cause: ", err);
  }
};

main();
