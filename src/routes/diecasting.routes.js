import express from "express";
import { getAllDiecastings, deleteDiecasting, updateDiecasting } from "../controllers/diecasting.controller.js";

const router = express.Router();

router.get("/all", getAllDiecastings);
router.delete("/delete/:id", deleteDiecasting);
router.put("/update/:id", updateDiecasting);

export default router;
