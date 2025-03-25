import {MaterialIssued} from '../models/materialIssued.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllMaterialIssued =  asyncHandler ( async (req,res)=>{
    const materialIssued = await MaterialIssued.find()

    //if database is empty
    if(!materialIssued){
        return res.status(204).json(
            new ApiResponse(204,{},"no material issued")
        )
    }

    return res.status(200).json(
        new ApiResponse(200,materialIssued,"no material recieved")
    )
})

export {
    getAllMaterialIssued
}