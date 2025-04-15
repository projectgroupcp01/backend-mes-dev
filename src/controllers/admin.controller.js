import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {Admin} from "../models/admin.model.js"
import {PreviousUser as Puser} from "../models/previousUser.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerAdmin = asyncHandler( async (req, res) => {
    
    const {userName,phoneNumber,jobType, password,aadhaarNo,isOwner } = req.body
    console.log("phoneNo : ", phoneNumber);
    console.log(aadhaarNo)

    //checking if any field is empty
    if (
        [userName,phoneNumber,jobType, password,aadhaarNo].some((field) => { return field?.trim() === ""})
    ) {
        throw new ApiError(400, "All fields are required")
    }
    //finding if userName or phoneNumber is already  in use
    const existedUser = await Admin.findOne({
        $or: [{ aadhaarNo }, { phoneNumber }]
    })

    //to check if user exists
    if (existedUser) {
        throw new ApiError(409, "User with phone number already exists")
    }   

    const user = await Admin.create({
        userName,
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

// /user/delete/:id
const deleteAdmin = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Find user by ID
    const userToDelete = await Admin.findById(userId);
    if (!userToDelete) {
        throw new ApiError(404, "User does not exist");
    }

    const { userName, phoneNumber, jobType, aadhaarNo } = userToDelete;
    console.log(userName,aadhaarNo)
     // user to add in previous user
     const userToAdd = await Puser.create({
        userName,
        phoneNumber,
        jobType,
        aadhaarNo
    })

    // Check if user already exists in Puser
    const existingUser = await Puser.findOne({ phoneNumber });
    if (!existingUser) {
        await Puser.create({ name, phoneNumber, jobType, aadhaarNo });
    }

    // Verify user was added to Puser
    const createdUser = await Puser.findOne({ phoneNumber });
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while adding user to previous user model");
    }

    // Delete user from User model
    const { acknowledged, deletedCount } = await Admin.deleteOne({ _id: userId });
    if (!acknowledged || deletedCount === 0) {
        throw new ApiError(500, "Something went wrong while deleting user");
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User Deleted Successfully")
    );
});

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

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutadmin = asyncHandler(async(req, res) => {
    await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


export {
    registerAdmin,
    loginAdmin,
    deleteAdmin,
    logoutadmin
}