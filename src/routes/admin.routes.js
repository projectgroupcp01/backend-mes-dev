import {registerAdmin,loginAdmin,deleteAdmin} from '../controllers/admin.controller.js'
import {Router} from 'express'

const router = Router()

router.route('/register-admin').post(registerAdmin)
router.route('/login-admin').post(loginAdmin)
router.route('/delete-admin/:id').post(deleteAdmin)

export default router