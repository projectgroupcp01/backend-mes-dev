import mongoose, { Schema } from "mongoose";
import Dyecasting from "./dyecasting.model"

// Sample part number to part name mapping
const partDetails = {
  "P001": "Part 1",
  "P002": "Part 2",
  "P003": "Part 3",
  "P004": "Part 4",
};

//object for part number : casting name
const castingDetails = {
  "P001": "casting 1",
  "P002": "casting 2",
  "P003": "casting 3",
  "P004": "casting 4"
}

// Define allowed part numbers for dropdown
const allowedPartNumbers = Object.keys(partDetails);

const OrderSchema = new Schema({
  partNumber: {
    type: String,
    enum: {
      values: allowedPartNumbers,
      message: 'Invalid part number. Must be one of: ' + allowedPartNumbers.join(', ')
    },
    required: [true, 'Part number is required']
  },
  partName: {
    type: String
  },
  poNumber: {
    type: String,
    required: [true, 'PO number is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  quantityProduced:{
    type:Number,
    default:0
  },
  dateOfOrder: {
    type: Date,
    default: Date.now
  },
  isComplete:{
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// hook to auto-fill partName or throw error and also check if additional casting are already produced 

OrderSchema.pre('save', async function (next) {
  try {
    // Validate and set partName
    if (!partDetails[this.partNumber]) {
      return next(new Error(`Part number "${this.partNumber}" is not recognized.`));
    }
    this.partName = partDetails[this.partNumber];

    // Get the corresponding casting name
    const castingName = castingDetails[this.partNumber];
    if (!castingName) {
      return next(new Error(`No casting name mapped for part number "${this.partNumber}".`));
    }

    // Fetch all dyecasting records with this casting name (additional castings)
    const matchingCastings = await Dyecasting.find({ castingName });

    // Sum quantityProduced from all matching dyecasting entries
    const totalProduced = matchingCastings.reduce((acc, curr) => {
      const qty = parseFloat(curr.quantityProduced); // Assuming it's stored as string
      return acc + (isNaN(qty) ? 0 : qty);
    }, 0);

    // Set quantityProduced in Order
    this.quantityProduced = totalProduced;

    next();
  } catch (error) {
    next(error);
  }
});


export const Order = mongoose.model('Order', OrderSchema);
