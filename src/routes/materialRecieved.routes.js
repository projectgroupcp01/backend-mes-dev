import { getAllMaterialRecieved } from "../controllers/materialRecieved.controller.js";
import {Router} from 'express'

const router = Router()

router.route('/get-all-recieved-material').get(getAllMaterialRecieved)

export default router