const express = require("express");
const cors = require('cors');
const bodyParser= require('body-parser');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const { MongoClient, ObjectId } = require('mongodb');
const data ={
    name:"Shakil",
    age:23,
    height:"180cm"
}
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASS;
//console.log(user);
const url = `mongodb+srv://${user}:${password}@cluster0.shiwe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(url);
async function run(){
    try {
        await client.connect();
        const database = client.db("selise");
        const collection = database.collection("student");
        console.log("success");
       
       
        app.get('/students',async(req,res)=>{
            await collection.find().toArray((err,result)=>{
                if(err)
                   console.log(err);
                else
                   res.send(result);
            })
        })
        app.post('/adduser',async(req,res)=>{
            //var name=req.body.name;
            try {
                await collection.insertOne(req.body);
                res.send({status:200});     
            } catch (error) {
                res.send(error);
            }

        })
        app.post('/deleteUser',async(req,res)=>{
            var id = req.body.id;
            try {
                 await collection.deleteOne({"_id": ObjectId(id)});
                 res.send({status:"delete successfully"})
            } catch (error) {
                res.send(error);
            }
        })
        app.post('/editUser',async(req,res)=>{
            var id = req.body._id;
            try {
                 await collection.updateOne({"_id": ObjectId(id)},
                 { $set:{"name":req.body.name, "roll":req.body.roll, "home":req.body.home}});
                 res.send(req.body);
            } catch (error) {
                res.send(error);
            }
        })

    } catch (error) {
        console.log(error);
    }
}
run();

app.get('/data',(req,res)=>{
    res.send(data);
})
const port = 5000;
app.listen(port,()=>{
    console.log("Listening at 5000");
})
