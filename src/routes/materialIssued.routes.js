import { getAllMaterialIssued } from "../controllers/materialIssued.controller.js";
import { getAllMaterialRecieved } from "../controllers/materialRecieved.controller.js";
import {Router} from 'express'

const router = Router()

router.route('/get-all').get(getAllMaterialIssued)

export default router