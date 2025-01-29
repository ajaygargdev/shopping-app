import jsonwebtoken from "jsonwebtoken";
import { logEvents } from "../logger/index.js";

export const checkAuth = async (req, res, next) => {
  try {
    if (
      req.url !== "/register" &&
      req.url !== "/login" &&
      !req.url.startsWith("/api/auth/")
    ) {
      const token = req.signedCookies["token"];
      if (!token) {
        console.log("--checkAuth-token missing--");
        return res.redirect("/login");
      }
      const user = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
      req.user = user;
      if (!user) {
        console.log("--checkAuth-invalid token--");
        return res.redirect("/login");
      }
    }
  } catch (err) {
    logEvents(err);
    return res.redirect("/login");
  }
  next();
};
