const database = require("../database/database")
const { Download } = require("../model/download")
const { Expense } = require("../model/expense")
const { User } = require("../model/user")
const AWS=require('aws-sdk');
require('dotenv').config();
//Leaderboard
module.exports.getAllExpenses=async(req,res,next)=>{
    try {
        //Optimization
        // const allExpenses=await User.findAll({
        //     attributes:['id','name',[database.fn('sum',database.col('expenses.amount')),'totalAmount']], //fn(method,table col,new name)
        //     include:[{
        //         model:Expense,
        //         attributes:[]
        //     }],
        //     group:['user.id'], //Grouped according to id column in users table
        //     order:[['totalAmount','DESC']] // Descending order related to totalAmount value
        // })
        const allExpenses=await User.findAll({
            attributes:['name','totalExpense'],
            order:[['totalExpense','DESC']]
        })
        res.status(200).send({expenses:allExpenses})

    } catch (error) {
        console.log(error);
    }
    
}

async function uploadToS3(data,filename) {
    const BUCKET_NAME=process.env.AWS_S3_NAME 
    const IAM_USER_KEY=process.env.IAM_USER_KEY
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET
    try {
        let s3bucket=new AWS.S3({
            accessKeyId:IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRET,
        })
        var params={
            Bucket:BUCKET_NAME,
            Body:data,
            Key:filename,
            ACL:'public-read'
        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,result)=>{
                if (err) {
                    reject(err)
                } else {
                    resolve(result.Location)   
                }
            })
        });
    } catch (error) {
        res.send({message:error,ok:false})
    }
}

module.exports.downloadAWS=async(req,res,next)=>{
    try {
        const getExpenses=await Expense.findAll({where:{UserId:req.userId}})
        const stringifyExpense=JSON.stringify(getExpenses)
        const filename=`Expenses/${req.userId}/${new Date()}.txt`
        const fileUrl=await uploadToS3(stringifyExpense,filename)
        const downloadTable=await Download.create({
            downloadLink:fileUrl,
            UserId:req.userId,
            date:new Date()
        })
        res.status(200).send({ok:true,fileUrl,stringifyExpense})
    } catch (error) {
        res.send({message:error,ok:false})
    }
}

module.exports.viewDownloads=async(req,res,next)=>{
    try {
        const downloads=await Download.findAll({where:{UserId:req.userId},order:[['date','DESC']]})
        res.send({ok:true,downloads:downloads})
    } catch (error) {
        res.send({ok:false,message:'Error'})
    }
}