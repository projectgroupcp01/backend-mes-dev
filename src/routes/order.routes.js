import {Router} from "express"
import {createOrder,getAllOrders} from "../controllers/order.controller.js"

const router = Router()

router.route('/create').post(createOrder)
router.route('/get-all').get(getAllOrders)
export default router