import mongoose from 'mongoose'
const connectDB = async () => {
    console.log(process.env.DB_ONLINE_URL);
    console.log(process.env.DB_OFFLINE_URL);
    const { DB_ONLINE_URL, DB_OFFLINE_URL, MOOD } = process.env
    return await mongoose.connect(`${MOOD == "DEV" ? DB_OFFLINE_URL : DB_ONLINE_URL}`)
        .then(res => console.log(`DB Connected successfully on .........`))
        .catch(err => console.log(` Fail to connect  DB.........${err} `))
}


export default connectDB;