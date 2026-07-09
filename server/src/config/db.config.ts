import mongoose from "mongoose"

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_DB_URL}/${process.env.DB_NAME}`)
        console.log("Database connected", connect.connection.host, connect.connection.name )
    } catch (error) {
        console.log("Error connecting to db", error)
        process.exit(1)
    }
}

export default connectDb;