const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASS;

const url = `mongodb+srv://${user}:${password}@cluster0.shiwe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(url);

const connectDB=async()=>{
    try {
        await client.connect();
        const database = client.db("selise");
        const collection = database.collection("student");
        console.log("success");
    } catch (error) 
    {
      console.log(error);
    }
}


const User=()=>{
    
    return 

}

module.exports={connectDB,User};