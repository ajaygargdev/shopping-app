import mongoose from "mongoose";
import { logEvents } from "./logger/index.js";

export const startDatabase = () =>
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.info("Database connected");
    })
    .catch((err) => {
      logEvents(err);
      console.log("Database connection error : ", err);
    });
