import mongoose from "mongoose";
import { createHmac, randomBytes } from "crypto";

const hashValue = (salt, value) =>
  createHmac("sha256", salt).update(value).digest("hex");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = randomBytes(16).toString();
    this.password = hashValue(salt, user.password);
    this.salt = salt;
  }
  next();
});

userSchema.static("matchPassword",async function (email, unHasedPassword) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Invalid user");
  }
  const { salt, password, ...rest } = user._doc;
  const hashedPassword = hashValue(salt, unHasedPassword);
  if (password !== hashedPassword) {
    throw new Error("Invalid password");
  }
  return rest;
});

export const userModel = mongoose.model("user", userSchema);
