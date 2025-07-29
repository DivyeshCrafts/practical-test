import express from 'express'
const app = express()
import cors from 'cors'
import helmet from 'helmet'

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cors())
app.use(helmet())

//routes
import { router } from './routes/index.js'
app.use('/api/v1', router)

//globle error handler
app.use((error, req, res, next)=>{
    const statusCode = error.statusCode || 500
    res.status(statusCode).json({statusCode, message: error?.message || 'Internel server error.'})
})

export {app}