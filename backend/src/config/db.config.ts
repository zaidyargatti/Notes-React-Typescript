import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const Connect_DB = async()=>{
    try {
        const inst =await mongoose.connect(process.env.DB_URL!)
        console.log(`Mongo DB Connected :${inst.connection.host}`)
    } catch (error) {
        console.log('Mongo Error :',error)
        process.exit(1)
        
    }

}

export default Connect_DB  