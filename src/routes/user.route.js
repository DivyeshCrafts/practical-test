import express from 'express'
const router = express.Router()

//middlewares
import {upload} from '../middlewares/multer.js'
import {jwtVerify} from '../middlewares/jwtVerify.js'
import {rolebaseAccess} from '../middlewares/rolebaseAcsess.js'

//user controllers
import {registration, login, getById, userTable, deleteUser, update, logout} from '../controllers/user.controller.js'

//validations
import {registrationValid, loginValid} from '../validations/user.validation.js'

router.post('/registration', upload.single('profile'), registrationValid, registration)
router.post('/login', loginValid, login)
router.get('/get_one/:id', jwtVerify, getById)
router.post('/userTable', jwtVerify, userTable)
router.delete('/delete/:id', jwtVerify, rolebaseAccess('user'), deleteUser)
router.put('/update/:id', jwtVerify, upload.single('profile'), rolebaseAccess('admin'), update)
router.post('/logout', jwtVerify, logout)

export {router}