const jwt  = require("jsonwebtoken")
require('dotenv').config()
module.exports.tokenDecrypt=(req,res,next)=>{
    try {
        const tokenId=req.header('Authorization')
        const decode=jwt.verify(tokenId,process.env.JWT_SECRET)
        req.userId=decode
        req.page=req.query.page
        next()  
    } catch (error) {
        res.send({message:'Token Error'})
    }
}