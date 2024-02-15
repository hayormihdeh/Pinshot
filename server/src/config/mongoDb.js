import mongoose from 'mongoose'

let isConnected = false

//checking if were connected to the database
export const connectToDb = async ()=> {
    if(isConnected) {
        console.log('MongoDB is already connected')
        return
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        isConnected = true
        console.log("MongoDb is connected")
    } catch (error) {
        console.log(error)
    }

}