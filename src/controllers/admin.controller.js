import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {Admin} from "../models/admin.model.js"
import {PreviousUser as Puser} from "../models/previousUser.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";



const registerAdmin = asyncHandler( async (req, res) => {
    
    const {name,phoneNumber,jobType, password,aadhaarNo,isOwner } = req.body
    console.log("phoneNo : ", phoneNumber);
    console.log(aadhaarNo)

    //checking if any field is empty
    if (
        [name,phoneNumber,jobType, password,aadhaarNo].some((field) => { return field?.trim() === ""})
    ) {
        throw new ApiError(400, "All fields are required")
    }
    //finding if userName or phoneNumber is already  in use
    const existedUser = await Admin.findOne({
        $or: [{ aadhaarNo }, { phoneNumber }]
    })

    //to check if user exists
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }   

    const user = await Admin.create({
        name,
        phoneNumber,
        jobType,
        password,
        aadhaarNo,
        isOwner
    })

    //to check if user is created or not
    const createdUser = await Admin.findById(user._id).select(
        "-password "
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const deleteAdmin = asyncHandler( async (req,res)=>{
    const userId = req.params.id
    const {name,phoneNumber,jobType,aadhaarNo} = await Admin.findById(userId)
    // if (!userToDelete) {
    //     throw new ApiError(404,"User doesnot exist")
    // }

    // user to add in previous user
    const userToAdd = await Puser.create({
        name,
        phoneNumber,
        jobType,
        aadhaarNo,
    })

    // To check if user is created
    const createdUser = await Puser.findOne({phoneNumber})
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while adding user to previous user model")
    }

    //To delete the user from User model
    const {acknowledged} = await Admin.deleteOne({phoneNumber})
    if (!acknowledged) {
        throw new ApiError(500, "Something went wrong while deleting user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Deleted Successfully")
    )
})

const loginAdmin = asyncHandler(async (req, res) =>{
  
    const {phoneNumber, password} = req.body

    if (!phoneNumber) {
        throw new ApiError(400, "phone number is required")
    }
    
    const user = await Admin.findOne({
        phoneNumber
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

//    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

//     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//     const options = {
//         httpOnly: true,
//         secure: true
//     }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            "User logged In Successfully"
        )
    )

})



export {
    registerAdmin,
    loginAdmin,
    deleteAdmin
}