const mongoose=require('mongoose')
const Schema=mongoose.Schema
const expenseSchema=new Schema({
    amount:{
        required:true,
        type:Number
    },
    description:{
        required:true,
        type:String
    },
    category:{
        required:true,
        type:String
    },
    date:{
        required:true,
        type:Date
    },
    UserId:{
        required:true,
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports=mongoose.model('Expense',expenseSchema);