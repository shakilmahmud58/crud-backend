const jwt = require("jsonwebtoken");

const auth =(req,res,next)=>{
    const token = req.headers.authtoken;
    if(token=='null')
    {
        console.log("no token");
        res.send({status:"no token"});

    }
    else
    {
        console.log(token);
        next();
    }

}



const verifyToken=(req,res,next)=>{
    const token = req.headers.authtoken || req.body.authtoken;
    //console.log(req.headers);
    if(token=='null')
    {
        
        res.send({status:false});

    }
    else
    {
        jwt.verify(token,process.env.SECRET,(err,decoded)=>{
            if(err)
            {
                console.log(err);
                res.send({status:false});
            }
            else
            {
                //console.log(decoded);
                next();
            }
        })
    }
}


module.exports = {auth,verifyToken};