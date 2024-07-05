import mongoose from "mongoose";
import app from "./app";
import { ENV } from "./config/env";

const PORT = ENV.PORT || 5000;
const DATABASE_URL = ENV.DATABASE_URL || "";

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error("Database connection error:", error);
  });
