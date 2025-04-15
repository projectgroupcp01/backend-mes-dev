import asyncHandler from "express-async-handler";
import { Diecasting } from "../models/diecasting.model.js";  // Import Diecasting model
import { ApiResponse } from "../utils/ApiResponse.js";  // Assuming you have this helper

// Controller to generate report based on selected date range, casting name, and rejection cause
const generateCastingReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, castingName, rejectionCause } = req.body;  // Get startDate, endDate, castingName, rejectionCause from the request body

  // Validate input dates
  if (!startDate || !endDate) {
    return res.status(400).json(new ApiResponse(400, null, "Start and End date are required"));
  }

  // Convert string dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate date range
  if (start > end) {
    return res.status(400).json(new ApiResponse(400, null, "Start date cannot be after end date"));
  }

  // Create the match object for filtering by date range
  const match = {
    createdAt: { $gte: start, $lte: end },  // Match documents within the date range
  };

  // Add filtering for castingName if provided
  if (castingName) {
    match.castingName = castingName;  // Filter by casting name if provided
  }

  // Aggregation pipeline to filter and group the data
  const report = await Diecasting.aggregate([
    {
      $match: match,  // First, match by date range and optional castingName filter
    },
    {
      $match: rejectionCause ? { rejectionCause: rejectionCause } : {},  // Second, filter by rejection cause if provided
    },
    {
      $group: {
        _id: { castingName: "$castingName", rejectionCause: "$rejectionCause" },  // Group by casting name and rejection cause
        totalQuantityProduced: { $sum: { $toDouble: "$quantityProduced" } },  // Sum of quantity produced
        totalQuantityRejected: { $sum: { $toDouble: "$quantityRejected" } },  // Sum of quantity rejected
      }
    },
    {
      $project: {
        castingName: "$_id.castingName",  // Rename _id to castingName
        rejectionCause: "$_id.rejectionCause",  // Rename _id to rejectionCause
        totalQuantityProduced: 1,  // Include totalQuantityProduced
        totalQuantityRejected: 1,  // Include totalQuantityRejected
        _id: 0  // Exclude _id from final result
      }
    }
  ]);

  // If no data found
  if (!report || report.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No data found for the given filters"));
  }

  // Return the aggregated report
  return res.status(200).json(new ApiResponse(200, report, "Report generated successfully"));
});

export { generateCastingReport };
