import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Diecasting } from "../models/diecasting.model.js";
import mongoose from "mongoose";

// GET all diecastings
const getAllDiecastings = asyncHandler(async (req, res) => {
    const diecastings = await Diecasting.find().populate("postedBy", "-password");

    if (!diecastings || diecastings.length === 0) {
        throw new ApiError(404, "No diecasting entries found");
    }

    return res.status(200).json(
        new ApiResponse(200, diecastings, "Diecasting entries fetched successfully")
    );
});

// DELETE diecasting by ID
const deleteDiecasting = asyncHandler(async (req, res) => {
    const diecastingId = req.params.id;

    const deletedDiecasting = await Diecasting.findByIdAndDelete(diecastingId);

    if (!deletedDiecasting) {
        throw new ApiError(404, "Diecasting entry not found");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedDiecasting, "Diecasting entry deleted successfully")
    );
});

// UPDATE diecasting by ID
const updateDiecasting = asyncHandler(async (req, res) => {
    const diecastingId = req.params.id;
    const updateData = req.body;

    const updatedDiecasting = await Diecasting.findByIdAndUpdate(
        diecastingId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!updatedDiecasting) {
        throw new ApiError(404, "Diecasting entry not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedDiecasting, "Diecasting entry updated successfully")
    );
});

export {
    getAllDiecastings,
    deleteDiecasting,
    updateDiecasting
};
