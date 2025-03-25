import {MaterialRecieved} from '../models/materialRecieved.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllMaterialRecieved =  asyncHandler ( async (req,res)=>{
    const materialRecieved = await MaterialRecieved.find()

    //if database is empty
    if(!materialRecieved){
        return res.status(204).json(
            new ApiResponse(204,{},"no material recieved")
        )
    }

    return res.status(200).json(
        new ApiResponse(200,materialRecieved,"no material recieved")
    )
})

export {
    getAllMaterialRecieved
}