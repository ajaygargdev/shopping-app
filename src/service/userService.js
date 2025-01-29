import { userModel } from "../model/userModel.js";

export const addUserService = async (userName, email, password) =>
  await userModel.create({ userName, email, password });

export const matchPasswordService = async (email, password) =>
  await userModel.matchPassword(email, password);
