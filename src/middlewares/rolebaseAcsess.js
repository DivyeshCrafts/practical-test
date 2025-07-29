import { ApiError } from "../utils/apiError.js"


const rolebaseAccess = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            throw new ApiError(403, 'You are not authorize to perfrom this action.')
        }
        next()
    }
}

export {rolebaseAccess}