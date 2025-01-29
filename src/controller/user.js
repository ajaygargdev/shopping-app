import jsonwebtoken from "jsonwebtoken";
import {
  addUserService,
  matchPasswordService,
} from "../service/userService.js";

export const signinHandler = async (req, res) => {
  const { email, password } = req?.body || {};
  if (!email || !password) {
    res.render("login", { error: "All values are requied" });
  } else {
    try {
      const result = await matchPasswordService(email, password);
      if (result) {
        const token = jsonwebtoken.sign(result, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.cookie("token", token, {
          maxAge: 3600000,
          signed: true,
          httpOnly: true,
        });
        res.redirect("/");
      } else {
        res.render("login", { error: "Invalid email or password" });
      }
    } catch (error) {
      res.render("login", { error: error || "Error" });
    }
  }
};

export const signupHandler = async (req, res, next) => {
  const { userName, email, password } = req?.body || {};
  if (
    !userName ||
    !email ||
    !password ||
    userName.length < 8 ||
    password.length < 8
  ) {
    res.render("register", { error: "All values are requied" });
  } else {
    try {
      await addUserService(userName, email, password);
      res.redirect("/login");
    } catch (error) {
      res.render("register", { error: error?.errmsg || "Error" });
    }
  }
};
