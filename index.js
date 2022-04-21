const express = require("express");
const app = express();

app.get('/data',(req,res)=>{
    res.send('Heloo');
})
const port = 5000;
app.listen(port,()=>{
    console.log("Listening at 5000");
})
