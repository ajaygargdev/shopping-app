import { Router } from "express";
import path from "path";

import {
  addProduct,
  deleteProduct,
  editProductPage,
  homePage,
  newProductPage,
  updateProduct,
} from "../controller/product.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, "src/static/uploads/images");
  },
  filename: function (req, file, callBack) {
    callBack(
      null,
      path.parse(file.originalname).name +
        "_" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

export const upload = multer({ storage: storage });

export const staticProductRouter = Router();
staticProductRouter.get("/", homePage);
staticProductRouter.get("/new", newProductPage);
staticProductRouter.get("/edit/:id", editProductPage);

export const apiProductRouter = Router();

apiProductRouter.post("/",upload.single('image'), addProduct);
apiProductRouter.put("/:id", upload.single("image"), updateProduct);
apiProductRouter.delete("/:id",  deleteProduct);
