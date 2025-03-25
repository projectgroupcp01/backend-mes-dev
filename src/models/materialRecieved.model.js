import mongoose,{Schema} from 'mongoose'

const materialRecievedSchema = new Schema(
    {
      materialGrade: {
        type: String,
        required: [true, "please add material grade"],
      },
      supplierName: {
        type: String,
        required: [true, "please add supplier name"],
      },
      purchaseOrderNumber: {
        type: String,
        required: [true, "please add purchase order number"],
      },
      challanNumber: {
        type: String,
        required: [true, "please add challan number"],
      },
      materialLotNumber: {
        type: String,
        required: [true, "please add material lot number"],
      },
      materialQuantity: {
        type: String,
        required: [true, "please add material quantity"],
      },
      materialQuantityKG: {
        type: String,
        required: [true, "please add material quantity in KG"],
      },
      locationAllocated: {
        type: String,
        required: [true, "please add location allocated"],
      },
      weightDiscrepancy: {
        type: String,
      },
      postedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    { timestamps: true }
  );

  export const MaterialRecieved = mongoose.model('MaterialRecieved',materialRecievedSchema)