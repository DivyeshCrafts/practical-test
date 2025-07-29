import mongoose from "mongoose";

const dbConnect = async ()=>{
    try {
        const dbConnected = await mongoose.connect(`${process.env.MONGO_DB_URL}${process.env.DB_NAME}`)
        console.log('Mongodb connected, port:', dbConnected.connection.port)
    } catch (error) {
        console.log('Mongodb connection error', error)
        process.exit(1)
    }
}

export {dbConnect}