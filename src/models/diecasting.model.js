import mongoose from "mongoose"

//schema
const dieCastingSchema = new mongoose.Schema(
    {
      castingName: {
        type: String,
        required: [true, "please add casting name"],
      },
      quantityProduced: {
        type: String,
        required: [true, "please add quantity produced"],
      },
      quantityProducedKG: {
        type: String,
        required: [true, "please add quantity produced in KG"],
      },
      shiftOfProduction: {
        type: String,
        required: [true, "please add shift of production"],
      },
      machineNumber: {
        type: String,
        required: [true, "please add machine number"],
      },
      furnaceTemperature: {
        type: String,
        required: [true, "please add machine temperature"],
      },
      dyeTemperature: {
        type: String,
        required: [true, "please add dye temperature"],
      },
      quantityRejected: {
        type: String,
        required: [true, "please add quantity rejected"],
      },
      rejectionCause: {
        type: String,
        required: [true, "please add cause"],
      },
      timeToFix: {
        type: String,
        required: [true, "please add time required to fix"],
      },
      machineDefectCause: {
        type: String,
        required: [true, "please add cause"],
      },
      imageUrl: { type: String, required: true },
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    { timestamps: true }
  );

export const Diecasting = mongoose.model('Diecasting',dieCastingSchema)