import {AsyncHandler} from '../utils/asyncHandler.js'
import {User} from '../models/user.model.js'
import {ApiError} from '../utils/apiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import {generateTokens} from '../utils/generateTokens.js'
import mongoose from 'mongoose'

const registration = AsyncHandler(async (req, res)=>{
    const reqBody = req.body
    const existUser = await User.findOne({email:reqBody.email})
    if(existUser){
        throw new ApiError(409, 'User already exist with email, try another.')
    }
    if(req.file){
        reqBody.profile = req.file.filename
    }
    const crateUser = await User.create(reqBody)
    if(!crateUser){
        throw new ApiError(500, 'User registration failed.')
    }
    const createdUser = await User.findById({_id: crateUser._id}).select('-password -refreshToken')
    res.status(201).json(new ApiResponse(201, createdUser, 'User registration successfull.'))
})

const login = AsyncHandler(async (req, res)=>{
    const {email, password} = req.body
    const existUser = await User.findOne({email:email})
    if(!existUser){
        throw new ApiError(404, 'User not found.')
    }
    //password check
    const isValidPassword = existUser.isPasswodValid(password)
    if(!isValidPassword){
        throw new ApiError(400, 'Invalid email or password.')
    }
    //generate token
    const accessToken = await generateTokens(existUser._id)
    const loggedUser = await User.findById(existUser._id).select('-password -refreshToken')
    res.status(200).json(new ApiResponse(200, {loggedUser, accessToken}, 'User login successfull.'))
})

const getById = AsyncHandler(async (req, res) => {
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, 'Id formate is  notvalid.')
    }
    const user = await User.findById(id).select('-password -refreshToken')
    if(!user){
        throw new ApiError(404, 'User not found.')
    }
    res.status(200).json(new ApiResponse(200, user, 'User data.'))
})

const userTable = AsyncHandler(async (req, res) => {
    const {page, limit} = req.body
    const skip = (page - 1) * limit

    const users = await User.aggregate([
        {$skip: skip},
        {$limit: limit}
    ])
    if(!users.length){
        throw new ApiError(404, 'Users not found.')
    }
    const UserCount = await User.countDocuments()
    const response = {
        data : users,
        page: page,
        total: UserCount,
    }
    res.status(200).json(new ApiResponse(200, response, 'Users data.'))
})

const deleteUser = AsyncHandler(async (req, res, next) => {
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, 'Id formet invalid')
    }
    const deleteUser = await User.findByIdAndDelete(id)
    if(!deleteUser){
        throw new ApiError(404, 'User not found.')
    }
    res.status(200).json(new ApiResponse(200, null, 'User delete successful.'))
})

const update = AsyncHandler(async (req, res) => {
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, 'Invalid user ID.')
    }
    const updatedData = req.body
    if(req.file){
        updatedData.profile = req.file.filename
    }
    const updateUser = await User.findByIdAndUpdate(id, updatedData, {new: true, runValidators: true}).select('-password')
    if(!updateUser){
        throw new ApiError(404, 'User not found.')
    }
    res.status(200).json(new ApiResponse(200, updateUser, 'User update successfull.'))
})

const logout = AsyncHandler(async (req, res) => {
    const id = req.user._id
    const user = await User.findById(id)
    if(!user){
        throw new ApiError(404, 'User not found.')
    }
    user.refreshToken = ""
    user.save()
    res.status(200).json(new ApiResponse(200, null, 'User logged out successfull.'))
})

export {registration, login, getById, userTable, deleteUser, update, logout}