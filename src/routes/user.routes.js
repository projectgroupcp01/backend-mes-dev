import {registerUser,deleteUser} from '../controllers/user.controller.js'
import {Router} from 'express'

const router = Router()

router.route('/register-user').post(registerUser)
router.route('/delete-user/:id').post(deleteUser)

export default router