const express=require('express')
const router=express.Router()
const login=require('../controller/login')
const expense=require('../controller/expense')
const user=require('../middleware/tokenDecrypt')
const purchase=require('../controller/purchase')
const premium=require('../controller/premium')
const forgotPassword  = require('../middleware/forgotPassword')
const { chart } = require('../controller/chart')
//Login and Signup
router.post('/newUser',login.newUser)
router.post('/loginUser',login.loginUser)
//Forgot password
router.post('/forgotPassword',forgotPassword.forgotPassword,login.forgotPassword)
router.get('/Password/:Id',forgotPassword.validateForgotPasswordLink)
router.post('/updatePassword/:Id',login.updatePassword)
// //Expenses
router.post('/addExpense',user.tokenDecrypt,expense.addExpense)
router.get('/getExpenses',user.tokenDecrypt,expense.getExpenses)
router.delete('/deleteExpense/:Id',user.tokenDecrypt,expense.deleteExpense)
router.put('/editExpense/:Id',user.tokenDecrypt,expense.editExpense)
router.get('/getExpense/:Id',user.tokenDecrypt,expense.getExpense)
// //Razorpay
router.get('/purchasePremium',user.tokenDecrypt,purchase.PurchasePremium)
router.post('/updateTransactionStatus',user.tokenDecrypt,purchase.updateTransactionStatus)
// //Premium features
router.get('/allExpenses',user.tokenDecrypt,premium.getAllExpenses) //Leaderboard
router.get('/verifyPremium',user.tokenDecrypt,premium.verifyPremium)
router.get('/chart',user.tokenDecrypt,chart)
router.get('/downloadExpense',user.tokenDecrypt,premium.downloadExpense)
router.get('/viewDownloads',user.tokenDecrypt,premium.viewDownloads)

module.exports=router