import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorlogger, logger } from "./logger/index.js";
import { fileURLToPath } from "url";
import path from "path";
import { authRouter } from "./routes/authRoutes.js";
import { checkAuth } from "./middleware/checkAuth.js";
import {
  apiProductRouter,
  staticProductRouter,
} from "./routes/productRoutes.js";
import { STATIC_PATH } from "./constents.js";
import { methodMiddleware } from "./middleware/methodMiddleware.js";
import {
  apiCartRouter,
  staticCartRouter,
  staticHomeRouter,
} from "./routes/cartRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();



export const app = express();
const PORT = process.env.PORT || 8000;

const COOKIE_SECRET = process.env.COOKIE_SECRET || "";



app.use(express.static(STATIC_PATH));
app.use(methodMiddleware);
app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use(checkAuth);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  req.user = null;
  res.clearCookie("token", { signed: true });
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.use("/cart", staticCartRouter);
app.use("/", staticHomeRouter);
app.use("/products/", staticProductRouter);
app.use("/api/products", apiProductRouter);
app.use("/api/cart", apiCartRouter);
app.use("/api/auth/", authRouter);

app.use((req, res) => {
  res.status(404).send("Page not found");
});

export const startServer = () => {
  app.server = app.listen(PORT, () =>
    console.info(`Server Started on port ${PORT}...`)
  );
};

app.use(errorlogger);
