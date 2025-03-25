import { getAllMaterialRecieved } from "../controllers/materialRecieved.controller.js";
import {Router} from 'express'

const router = Router()

router.route('/get-all').get(getAllMaterialRecieved)

export default router