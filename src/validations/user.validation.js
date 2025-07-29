import { ApiError } from '../utils/apiError.js'
import {validation} from '../utils/validate.js'

const registrationValid = (req, res, next)=>{
    const rulse = {
        name: 'required',
        email: 'required',
        password: 'required',
        role: 'required',
    }
    validation(req.body, rulse, (data, status)=>{
        if(!status){
            throw new ApiError(400, data.errors)
        }
        next()
    })
}

const loginValid = (req, res, next)=>{
    const rulse = {
        email: 'required',
        password: 'required'
    }
    validation(req.body, rulse, (data, status)=>{
        if(!status){
            throw new ApiError(400, data.errors)
        }
        next()
    })

}
export {registrationValid, loginValid}