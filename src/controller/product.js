import { IMAGE_PATH, STATIC_PATH } from "../constents.js";
import fs from "fs";
import {
  addProductService,
  getAllProductsService,
  getProductByIdService,
  removeProductService,
  updateProductByIdService,
} from "../service/productService.js";
import { logEvents } from "../logger/index.js";

export const homePage = async (req, res) => {
  const error = req.query?.error || null;
  try {
    const products = await getAllProductsService();
    res.render("products/index", { products, user: req.user, error });
  } catch (err) {
    res.status(500).send("Error retrieving product");
  }
};

export const newProductPage = async (req, res) => {
  const error = req.query?.error || null;

  res.render("products/newProduct", { error });
};

export const editProductPage = async (req, res, next) => {
  const error = req.query?.error || null;
  try {
    const product = await getProductByIdService(req.params.id);
    res.render("products/editProduct", { product, error });
  } catch (err) {
    res.status(500).send("Error retrieving product");
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity } = req?.body || {};
    if (!name || !description || !price || !quantity || !req.file) {
      res.redirect(`/products/new?error=${"All values are requied"}`);
    } else {
      const imagePath = req.file ? IMAGE_PATH + req.file.filename : "";
      console.log("--addProduct-req.file--", req.file);
      const result = await addProductService(
        name,
        description,
        price,
        quantity,
        imagePath,
        req.user
      );
      res.redirect("/products");
    }
  } catch (error) {
    logEvents(error);
    res.redirect(`/products/new?error=${error?.errmsg || "Error"}`);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, image, oldImage } =
      req?.body || {};
    console.log("--updateProduct-image--", image);
    if (!name || !description || !price || !quantity) {
      res.redirect(
        `/products/edit/${req?.params?.id}?error=${"All values are requied"}`
      );
    } else {
      const imagePath = req.file ? IMAGE_PATH + req.file.filename : oldImage;
      const result = await updateProductByIdService(
        req.params.id,
        name,
        description,
        price,
        quantity,
        imagePath,
        req.user
      );
      console.log("--updateProduct-oldImage--", oldImage);
      console.log("--updateProduct-imagePath--", imagePath);
      if (oldImage !== imagePath && fs.existsSync(STATIC_PATH + oldImage)) {
        fs.unlinkSync(STATIC_PATH + oldImage);
      }
      res.redirect("/products");
    }
  } catch (error) {
    logEvents(error);
    res.redirect(
      `/products/edit/${req?.params?.id}?error=${error?.errmsg || "Error"}`
    );
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const result = await removeProductService(req.params.id);
    console.log("--deleteProduct-result--", result);
    if (fs.existsSync(STATIC_PATH + result.image)) {
      fs.unlinkSync(STATIC_PATH + result.image);
    }
    res.redirect("/products");
  } catch (error) {
    logEvents(error);
    res.redirect(`/products?error=${error?.errmsg || "Error"}`);
  }
};
