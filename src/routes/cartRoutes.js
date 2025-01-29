import { Router } from "express";
import { addCart, cartPage, homePage, removeCart, updateCart } from "../controller/cart.js";



export const staticHomeRouter = Router();
staticHomeRouter.get("/", homePage);

export const staticCartRouter = Router();
staticCartRouter.get("/", cartPage);

export const apiCartRouter = Router();
apiCartRouter.post("/",addCart);
apiCartRouter.delete("/:id",removeCart);
apiCartRouter.put("/:id",updateCart);


