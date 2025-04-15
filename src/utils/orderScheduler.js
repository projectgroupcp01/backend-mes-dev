import cron from "node-cron";
import mongoose from "mongoose";
import { Order } from "./models/order.model.js";
import { Dyecasting } from "./models/dyecasting.model.js";
import { CastingUtilized } from "./models/castingUtilized.model.js";
import { castingDetails } from "./constant.js";

// Run this scheduler every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("🔄 Scheduler running at", new Date().toLocaleString());

  try {
    const pendingOrders = await Order.find({ isComplete: false });

    for (const order of pendingOrders) {
      const castingName = castingDetails[order.partNumber];
      if (!castingName) continue;

      const matchingCastings = await Dyecasting.find({ castingName });

      for (const casting of matchingCastings) {
        const qtyProduced = casting.quantityProduced || 0;
        const remainingOrderQty = order.quantity - order.quantityProduced;

        if (qtyProduced <= 0 || remainingOrderQty <= 0) continue;

        const qtyToUse = Math.min(qtyProduced, remainingOrderQty);

        // Create new entry in CastingUtilized with used quantity
        await CastingUtilized.create({
          castingName: casting.castingName,
          quantityUsed: qtyToUse,
          quantityProducedKG: casting.quantityProducedKG,
          shiftOfProduction: casting.shiftOfProduction,
          machineNumber: casting.machineNumber,
          furnaceTemperature: casting.furnaceTemperature,
          dyeTemperature: casting.dyeTemperature,
          quantityRejected: casting.quantityRejected,
          rejectionCause: casting.rejectionCause,
          timeToFix: casting.timeToFix,
          machineDefectCause: casting.machineDefectCause,
          imageUrl: casting.imageUrl,
          postedBy: casting.postedBy,
          poNumber: order.poNumber
        });

        // Update order's quantityProduced and check if complete
        order.quantityProduced += qtyToUse;
        if (order.quantityProduced >= order.quantity) {
          order.isComplete = true;
        }
        await order.save();

        // Handle remaining casting quantity
        const leftover = qtyProduced - qtyToUse;
        if (leftover <= 0) {
          await Dyecasting.findByIdAndDelete(casting._id);
        } else {
          await Dyecasting.findByIdAndUpdate(casting._id, {
            quantityProduced: leftover
          });
        }

        // If order is fulfilled, break out of casting loop
        if (order.isComplete) break;
      }
    }

    console.log("Scheduler completed at", new Date().toLocaleString());
  } catch (error) {
    console.error(" Error in scheduler:", error.message);
  }
});
