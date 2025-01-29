import { productModel } from "../model/productModel.js";
import { cartModel } from "../model/cartModel.js";

export const getCartProductsService = async (user) => {
  const products = await productModel.aggregate([
    {
      $lookup: {
        from: "carts", // Collection name (cart)
        localField: "_id", // Local product ID field
        foreignField: "product", // Foreign field in the cart collection
        as: "cartDetails", // Result of the join will be stored in cartDetails
      },
    },
    {
      $addFields: {
        // Calculate the sum of quantities in the cart for each product
        totalInCart: { $sum: "$cartDetails.quantity" },
        totalAddedByUser: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: "$cartDetails",
                  as: "cartItem",
                  cond: {
                    $eq: [{ $toString: "$$cartItem.createdBy" }, user._id],
                  }, // Filter cart items by user ID
                },
              },
              as: "filteredCart",
              in: "$$filteredCart.quantity", // Sum the quantities of the filtered cart items
            },
          },
        },
        cartDetail: {
          $arrayElemAt: [
            {
              $sortArray: {
                input: {
                  $filter: {
                    input: "$cartDetails",
                    as: "cartItem",
                    cond: {
                      $eq: [{ $toString: "$$cartItem.createdBy" }, user._id], // Only the user's carts
                    },
                  },
                },
                sortBy: { createdAt: -1 }, // Sort by createdAt in descending order (latest first)
              },
            },
            0, // Get the first item (latest cart)
          ],
        },
      },
    },
    {
      $match: {
        totalAddedByUser: { $gt: 0 },
      },
    },
    {
      $project: {
        // Only include the necessary fields in the result
        _id: 1,
        name: 1,
        description: 1,
        price: 1,
        quantity: 1,
        image: 1,
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
        updatedBy: 1,
        remainingQty: {
          $subtract: ["$quantity", "$totalInCart"], // Calculate remaining quantity
        },
        totalAddedByUser: 1,
        cartDetail: 1,
      },
    },
  ]);
  return products;
};

export const getProductDetailByIdService = async (prodId) => {
  const products = await productModel.aggregate([
    {
      $match: {
        $expr: { $eq: [{ $toString: "$_id" }, { $toString: prodId }] },
      },
    },
    {
      $lookup: {
        from: "carts", // Collection name (cart)
        localField: "_id", // Local product ID field
        foreignField: "product", // Foreign field in the cart collection
        as: "cartDetails", // Result of the join will be stored in cartDetails
        let: { productId: "$_id" }, // Define the variable "productId" to hold the current product's "_id"
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$productId", "$product"] }, // Compare "productId" with the "product" field in "carts"
            },
          },
        ],
      },
    },
    {
      $addFields: {
        totalInCart: { $sum: "$cartDetails.quantity" },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        price: 1,
        quantity: 1,
        image: 1,
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
        updatedBy: 1,
        remainingQty: {
          $subtract: ["$quantity", "$totalInCart"], // Calculate remaining quantity
        },
        cartDetails: 1,
      },
    },
  ]);
  return products;
};

export const addToCartService = async (prodId, qty, user) => {
  return await cartModel.create({
    product: prodId,
    quantity: qty,
    createdBy: user._id,
  });
};

export const removeFromCartService = async (id) =>
  await cartModel.findByIdAndDelete(id);

export const updateQtyToCartService = async (id, qty, user) =>
  await cartModel.findByIdAndUpdate(
    id,
    {
      $inc: { quantity: qty },
      updatedBy: user._id,
    },
    { new: true }
  );
