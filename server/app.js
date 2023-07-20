const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')
const router=require('./router/router')
const mongoose=require('mongoose')

require('dotenv').config()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.use(router)

//wrongUrl
app.use('/',(req,res)=>{
    res.redirect('https://gagan-expense-tracker-fullstack.netlify.app')
})

mongoose.connect(`mongodb+srv://gagangani17:${process.env.MONGODB_PASSWORD}@expensetracker.gfsce6y.mongodb.net/master?retryWrites=true&w=majority`).then(res=>app.listen(process.env.PORT)).catch(err=>console.log(err))
