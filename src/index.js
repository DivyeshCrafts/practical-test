import 'dotenv/config'
import {app} from './app.js'
import {dbConnect} from './config/dbConnect.js'
const PORT = process.env.PORT || 4240

dbConnect()
.then(()=>{
    app.listen(PORT, ()=>{
        console.log('Server runing on port:', PORT)
    })
})
.catch((error)=>{
    console.log('Mongodb connection error', error)
    process.exit(1)
})