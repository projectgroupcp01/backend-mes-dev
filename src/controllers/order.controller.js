import asyncHandler from "express-async-handler";
import { Order } from "../models/order.model.js"; // adjust the path based on your file structure
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createOrder = asyncHandler(async (req, res) => {
  const { partNumber, poNumber, quantity } = req.body;

  // Logging input values
  console.log("Received order:", { partNumber, poNumber, quantity });

  // Validate required fields
  if (
    [partNumber, poNumber, quantity].some((field) =>
     { return  field.trim() === "" }
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //  Validate quantity is a positive number
  if (typeof quantity !== "number" || quantity <= 0) {
    throw new ApiError(400, "Quantity must be a positive number");
  }

  // Check if an order with same PO number already exists
  const existingOrder = await Order.findOne({ poNumber });
  if (existingOrder) {
    throw new ApiError(409, "Order with this PO number already exists");
  }

  // Create the order
  const order = await Order.create({
    partNumber,
    poNumber,
    quantity,
  });

  // Verify creation of oreder
  if (!order) {
    throw new ApiError(500, "Something went wrong while creating the order");
  }

  return res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
});

export { createOrder };
