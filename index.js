// const express =require('express');

// const app = express();
// const {connectDB,User} =require('./database/connection')
// connectDB();

// app.get('/get',async(req,res)=>{
//                 await connectDB.collection.find().toArray((err,result)=>{
//                 if(err)
//                    console.log(err);
//                 else
//                 {
//                     res.send(result);
//                 }
//             })
// })
const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser= require('body-parser');
const {auth, verifyToken}  = require('./middleware/auth');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const { MongoClient, ObjectId } = require('mongodb');
// const data ={
//     name:"Shakil",
//     age:23,
//     height:"180cm"
// }
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
        const User = database.collection("user");
        console.log("success");
       
       
        app.get('/students',async(req,res)=>{
            await collection.find().toArray((err,result)=>{
                if(err)
                   console.log(err);
                else
                {
                    res.send(result);
                }
            })
        })
        app.post('/adduser', verifyToken ,async(req,res)=>{
            //var name=req.body.name;
            try {
                await collection.insertOne(req.body);
                res.send({status:200,data:req.body});     
            } catch (error) {
                res.send(error);
            }

        })
        app.post('/deleteUser',verifyToken,async(req,res)=>{
            var id = req.body.id;
            try {
                 await collection.deleteOne({"_id": ObjectId(id)});
                 res.send({status:"delete successfully"})
            } catch (error) {
                res.send(error);
            }
        })
        app.post('/editUser',verifyToken,async(req,res)=>{
            var id = req.body._id;
            try {
                 await collection.updateOne({"_id": ObjectId(id)},
                 { $set:{"name":req.body.name, "roll":req.body.roll, "home":req.body.home}});
                 res.send(req.body);
            } catch (error) {
                res.send(error);
            }
        })
       
        //sign up related

        const payload={ name:"shakil", admin:false };
        const secret = process.env.SECRET;
        app.get('/isloggedin',verifyToken, (req,res)=>{
            res.send({status:true});
        })
        app.post('/loggedin',verifyToken, (req,res)=>{
            res.send({status:true});
        })
        app.post('/signup',async(req,res)=>{
            const newUser = req.body;
            const x = await User.findOne({email:newUser.email});
            if(x==null)
            {
                await User.insertOne(req.body);
                res.send({status:1})
            }
            else
            {
                res.send({status:0});
            }
        })
        app.post('/login' ,async(req,res)=>{
            const user = req.body;
            const legalUser = await User.findOne({email:user.email, pass:user.pass});
            if(legalUser==null)
            {
                res.send({token:null})
            }
            else
            {
                //console.log(user);
                const token = jwt.sign(payload,secret,{expiresIn:"2h"});
                res.send({token});
            }

        })

    } catch (error) {
        console.log(error);
    }
}
run();

app.get('/data',(req,res)=>{
    res.send('data');
})
const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("Listening at 5000");
})
