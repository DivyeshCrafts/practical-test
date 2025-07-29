import { User } from "../models/user.model.js"
import { ApiError } from "./apiError.js"



const generateTokens = async (id) => {
    const existUser = await User.findById(id)
    if(!existUser){
        throw new ApiError(404, 'user not found.')
    }
    const accessToken = await existUser.generateAccessToken()
    const refreshToken = await existUser.generateRefreshToken()
    existUser.refreshToken = refreshToken
    await existUser.save({validateBeforeSave:false})
    return accessToken
}

export {generateTokens}