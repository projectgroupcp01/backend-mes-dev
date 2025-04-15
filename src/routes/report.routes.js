import {generateCastingReport} from '../controllers/report.controller.js'
import {Router} from "express"

const router = Router()

router.route('/generateReports/diecasting').get(generateCastingReport)

export default router