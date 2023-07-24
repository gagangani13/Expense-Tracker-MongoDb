const  Download = require("../model/download")
const  Expense = require("../model/expense")
const  User = require("../model/user")
const AWS=require('aws-sdk');
const excelJS = require("exceljs");
require('dotenv').config();
//Leaderboard
module.exports.getAllExpenses=async(req,res,next)=>{
    try {
        const allExpenses=await User.find().select('name totalExpense').sort({totalExpense:-1})
        res.status(200).send({expenses:allExpenses})

    } catch (error) {
        console.log(error);
        res.send({error:error,ok:false})
    }
    
}


module.exports.downloadExpense = async (req, res) => {
  const BUCKET_NAME = process.env.AWS_S3_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  const s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });
  try {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Expenses');
    worksheet.columns = [
      { header: 'Sl.No', key: 'slNo' },
      { header: 'Amount', key: 'amount' },
      { header: 'Description', key: 'description' },
      { header: 'Category', key: 'category' },
      { header: 'Date', key: 'date' },
    ];

    const getExpenses = await Expense.find({ UserId: req.userId }).sort({
      date: -1,
    });
    const dataWithSlNo = getExpenses.map((data, index) => ({
      ...data.toJSON(),
      slNo: index + 1,
    }));

    dataWithSlNo.forEach((data) => {
      worksheet.addRow(data);
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const params = {
      Bucket: BUCKET_NAME,
      Key: `Expenses/${req.userId}/${new Date().toISOString()}.xlsx`,
      Body: buffer,
      ACL: 'public-read',
      ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        console.error(err);
        res.send({ ok: false, error: 'Upload to S3 Failed!' });
      } else {
        try {
          const downloadTable = new Download({
            downloadLink: data.Location,
            UserId: req.userId,
            date: new Date(),
          });
          await downloadTable.save();
          res.send({
            ok: true,
            message: 'File uploaded successfully to S3',
            s3Url: data.Location,
          });
        } catch (error) {
          console.error(error);
          res.send({ ok: false, error: 'Upload Failed!' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.send({ ok: false, error: 'Download Failed!' });
  }
};
module.exports.viewDownloads=async(req,res,next)=>{
    try {
        const downloads=await Download.find({UserId:req.userId}).sort({date:-1})
        res.send({ok:true,downloads:downloads})
    } catch (error) {
        res.send({ok:false,message:'Error'})
    }
}

module.exports.verifyPremium=async(req,res,next)=>{
    try {
        const getUser=await User.findById(req.userId)
        if (getUser.premium) {
            res.send({ok:true})
        }else{
            throw new Error()
        }
    } catch (error) {
        res.send({ok:false})
    }
}