import mongoose,{Schema} from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "please add name"],
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: [true, "please add phone number"],
        unique: true,
      },
      jobType: {
        type: String,
        enum: ["Inventory", "Die Casting", "Shot Blasting", "Flatling","Admin"],
        required: true,
      },
      aadhaarNo:{
        type: String,
        required:[true,'please add aadhaar number']
      }
},{timestamps:true})


export const PreviousUser = mongoose.model('PreviousUser',userSchema)