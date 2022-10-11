import {Router} from 'express'
import publicController from "../../controllers/public";
const router = Router()

router.post('/login', publicController.login)

export default router