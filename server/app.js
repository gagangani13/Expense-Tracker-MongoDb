const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')
const router=require('./router/router')
const mongoose=require('mongoose')
const { User } = require('./model/user')
// const { Expense } = require('./model/expense')
// const { Order } = require('./model/order')
// const { ForgotPassword } = require('./model/forgotPassword')
require('dotenv').config()
// const { Download } = require('./model/download')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// User.hasMany(Expense)
// Expense.belongsTo(User)

// User.hasMany(Order)
// Order.belongsTo(User)

// User.hasMany(ForgotPassword)
// ForgotPassword.belongsTo(User)

// User.hasMany(Download)
// Download.belongsTo(User)

app.use(router)

//wrongUrl
app.use('/',(req,res)=>{
    res.redirect('https://localhost:3000/')
})

mongoose.connect(`mongodb+srv://gagangani17:${process.env.MONGODB_PASSWORD}@expensetracker.gfsce6y.mongodb.net/master?retryWrites=true&w=majority`).then(res=>app.listen(process.env.PORT)).catch(err=>console.log(err))
