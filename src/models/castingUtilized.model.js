import mongoose from "mongoose";

const castingUtilizedSchema = new mongoose.Schema(
  {
    castingName: {
      type: String,
      required: [true, "Please add casting name"],
    },
    quantityUsed: {
      type: String,
      required: [true, "Please add quantity produced"],
    },
    quantityProducedKG: {
      type: String,
      required: [true, "Please add quantity produced in KG"],
    },
    shiftOfProduction: {
      type: String,
      required: [true, "Please add shift of production"],
    },
    machineNumber: {
      type: String,
      required: [true, "Please add machine number"],
    },
    furnaceTemperature: {
      type: String,
      required: [true, "Please add furnace temperature"],
    },
    dyeTemperature: {
      type: String,
      required: [true, "Please add dye temperature"],
    },
    quantityRejected: {
      type: String,
      required: [true, "Please add quantity rejected"],
    },
    rejectionCause: {
      type: String,
      required: [true, "Please add rejection cause"],
    },
    timeToFix: {
      type: String,
      required: [true, "Please add time required to fix"],
    },
    machineDefectCause: {
      type: String,
      required: [true, "Please add machine defect cause"],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    poNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Please provide the Order ID (poNumber)"],
    },
  },
  { timestamps: true }
);

export const CastingUtilized = mongoose.model("CastingUtilized", castingUtilizedSchema);
