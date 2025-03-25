import {registerAdmin,deleteAdmin} from '../controllers/admin.controller.js'
import {Router} from 'express'

const router = Router()

router.route('/register-admin').post(registerAdmin)
router.route('/delete-admin/:id').post(deleteAdmin)

export default router