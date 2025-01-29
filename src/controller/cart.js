import { logEvents } from "../logger/index.js";
import { ws } from "../webSocketServer.js";
import {
  addToCartService,
  getCartProductsService,
  getProductDetailByIdService,
  removeFromCartService,
  updateQtyToCartService,
} from "../service/cartService.js";
import { getProductsWithCartDetailsService } from "../service/productService.js";

export const homePage = async (req, res) => {
  const user = req.user;
  const error = req.query?.error || null;
  try {
    const products = await getProductsWithCartDetailsService(user);
    res.render("index", { products, user: user, error });
  } catch (err) {
    logEvents(err);
    res.status(500).send("Error retrieving product");
  }
};

export const cartPage = async (req, res) => {
  const user = req.user;
  const error = req.query?.error || null;
  try {
    const products = await getCartProductsService(user);
    res.render("cart/index", {
      products,
      user: user,
      userId: user._id,
      port: process.env.SOCKET_PORT,
      error,
    });
  } catch (err) {
    logEvents(err);
    res.status(500).send("Error retrieving product");
  }
};

export const addCart = async (req, res, next) => {
  try {
    const { productId } = req?.body;
    if (productId) {
      const result = await addToCartService(productId, 1, req.user);
      if (result) {
        const updatedResultByProdId = await getProductDetailByIdService(
          result.product
        );
        ws.emit("cart", {
          type: "update",
          data: updatedResultByProdId,
        });
      }
      res.redirect("/");
    } else {
      res.redirect(`/?error=Invalid Product`);
    }
  } catch (error) {
    logEvents(error);
    res.redirect(`/?error=${error?.errmsg || "Error"}`);
  }
};

export const removeCart = async (req, res, next) => {
  const reqFrom = req?.query?.from || "";
  try {
    const { id } = req.params;
    const result = await removeFromCartService(id);
    console.log("--removeCart-result--",result);
    if (result) {
      const updatedResultByProdId = await getProductDetailByIdService(
        result.product
      );
      ws.emit("cart", {
        type: "update",
        data: updatedResultByProdId,
      });
    }
    res.redirect(`/${reqFrom}`);
  } catch (error) {
    logEvents(error);
    res.redirect(`/${reqFrom}?error=${error?.errmsg || "Error"}`);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const qty = parseInt(req.query?._qty || "0");
    const result = await updateQtyToCartService(id, qty, req.user);
    if (result && result.quantity < 1) {
      await removeFromCartService(id);
    }
    const updatedResultByProdId = await getProductDetailByIdService(
      result.product
    );
    ws.emit("cart", {
      type: "update",
      data: updatedResultByProdId,
    });
    res.redirect("/cart");
  } catch (error) {
    logEvents(error);
    res.redirect(`/cart?error=${error?.errmsg || "Error"}`);
  }
};
