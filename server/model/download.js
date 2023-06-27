const mongoose=require('mongoose')
const Schema=mongoose.Schema
const downloadSchema=new Schema({
    downloadLink:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    UserId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})
module.exports=mongoose.model('Download',downloadSchema)