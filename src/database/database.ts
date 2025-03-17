import mongoose from "mongoose";
import { env } from "../common/utils/env.config";

export const initializeDatabaseConnection = async () => {
  for (let i = 1; i < 3; ++i) {
    try {
      console.log(`Connecting to db...(${i})`);
      await mongoose.connect(env.MONGODB_URI);

      break;
    } catch (err) {
      console.log("Failed", i);
      if (i >= 2) {
        throw err;
      }
    }
  }
};
