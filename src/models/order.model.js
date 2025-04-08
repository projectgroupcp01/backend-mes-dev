import mongoose, { Schema } from "mongoose";

// Sample part number to part name mapping
const partDetails = {
  "P001": "Part 1",
  "P002": "Part 2",
  "P003": "Part 3",
  "P004": "Part 4",
};

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
  dateOfOrder: {
    type: Date,
    default: Date.now
  },
  isComplete:{
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// hook to auto-fill partName or throw error
OrderSchema.pre('save', function (next) {
  if (!partDetails[this.partNumber]) {
    return next(new Error(`Part number "${this.partNumber}" is not recognized.`));
  }
  this.partName = partDetails[this.partNumber];
  next();
});

export const Order = mongoose.model('Order', OrderSchema);
