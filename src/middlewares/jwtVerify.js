import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import jwt from 'jsonwebtoken'


const jwtVerify = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new ApiError(401, 'Unauthoriz')
    }
    const token = authHeader.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken._id)
    if(!User){
        throw new ApiError(401, 'Unauthoriz')
    }
    req.user = user
    next()
}

export {jwtVerify}