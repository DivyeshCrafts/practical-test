import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    city: {type: String, default: ''},
    profile: {type: String, default: ''},
    role: {type: String, enum: ['admin', 'user'], default:'user'},
    refreshToken: {type: String, default: ''},
}, {timestamps:true})

//hash password
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) next()
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})

// validet password
userSchema.methods.isPasswodValid = async function (password) {
    return bcrypt.compareSync(password, this.password)
}

//generate access token
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        password: this.password,
        city: this.city,
        role: this.role,
    }, process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPRIY})
}

//generate refresh token
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPRIY})
}

export const User = mongoose.model('User', userSchema)