const ForgotPassword = require("../model/forgotPassword")
const User  = require("../model/user")
require('dotenv').config()
module.exports.forgotPassword=async(req,res,next)=>{
    try {
        const {email}=req.body
        const findEmail=await User.findOne({email})
        const createForgotPasswordUUID=new ForgotPassword({
            isActive:true,
            UserId:findEmail._id
        })
        const save=await createForgotPasswordUUID.save()
        req.UUID=save._id;
        next();
    } catch (error) {
        return res.send({message:"User doesn't exists"})
    }
    
}

module.exports.validateForgotPasswordLink=async(req,res,next)=>{
    try {
        const UUID=req.params.Id
        const findPassword=await ForgotPassword.findOne({_id:UUID})
        if (findPassword.isActive==1||null){
            res.redirect(`https://gagan-expense-tracker-fullstack.netlify.app/Password/${UUID}`)
        }else{
            res.send('<h1>The link has been expired. Please request via <a href="https://gagan-expense-tracker-fullstack.netlify.app">Expense Tracker</a></h1>')
        }
    } catch (error) {
        res.send({message:error})
    }
}