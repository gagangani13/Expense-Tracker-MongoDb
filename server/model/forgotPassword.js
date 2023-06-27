const mongoose=require('mongoose')
const Schema=mongoose.Schema
const forgotPasswordSchema=new Schema({
    isActive:{type:Boolean,required:true},
    UserId:{type:Schema.Types.ObjectId,ref:'User',required:true}
})
module.exports=mongoose.model('ForgotPassword',forgotPasswordSchema)