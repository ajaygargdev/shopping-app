import { productModel } from "../model/productModel.js";

export const getProductsWithCartDetailsService = async (user) =>
  await productModel.aggregate([
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

export const getAllProductsService = async () => await productModel.find({});

export const getProductByIdService = async (id) =>
  await productModel.findById(id);

export const addProductService = async (
  name,
  description,
  price,
  quantity,
  imagePath,
  user
) =>
  await productModel.create({
    name,
    description,
    price,
    quantity,
    image: imagePath,
    createdBy: user._id,
  });

export const updateProductByIdService = async (
  id,
  name,
  description,
  price,
  quantity,
  imagePath,
  user
) =>
  await productModel.findByIdAndUpdate(id, {
    name,
    description,
    price,
    quantity,
    image: imagePath,
    updatedBy: user._id,
  });

export const removeProductService = async (id) =>
  await productModel.findByIdAndDelete(id);
