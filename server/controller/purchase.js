const Razorpay=require('razorpay')
const { Order } = require('../model/order')
const { User } = require('../model/user')
const database = require('../database/database')
require('dotenv').config()

module.exports.PurchasePremium=(req,res,next)=>{
    try {
        const rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEYID,
            key_secret:process.env.RAZORPAY_KEYSECRET
        })
        rzp.orders.create({amount:250*100,currency:'INR'},async(err,order)=>{
            if(err){
                throw new Error(err)
            }
            const createOrder=await Order.create({
                orderId:order.id,
                status:'PENDING',
                UserId:req.userId
            })
            try {
                res.status(201).send({order,key_id:rzp.key_id})
            } catch (error) {
                throw new Error(error)
            }
        })
    } catch (error) {
        console.log(error);
        res.send({error:'Something went wrong',error})
    }
}

module.exports.updateTransactionStatus=async(req,res,next)=>{
    try {
        const t=await database.transaction();
        const{orderId,paymentId}=req.body
        const getOrder=await Order.findOne({where:{orderId}})
        const getUser=await User.findByPk(req.userId)
        // const orderUpdate=await getOrder.update({paymentId:paymentId,status:'SUCCESS'})  This will take 5sec
        // const premiumUser=await getUser.update({premium:'true'}) This will take another 5, total 10sec
        //so to optimize the code promise all is used.
        const promise1=getOrder.update({paymentId:paymentId,status:'SUCCESS'},{transaction:t})
        const promise2=getUser.update({premium:'true'},{transaction:t})
        Promise.all([promise1,promise2]).then(async()=>{
            await t.commit()
            res.send({message:'Transaction Successful',ok:true})
        })
        .catch(async(err)=>{
            await t.rollback()
            res.send(err)
        })
    } catch (error) {
        await t.rollback()
        res.send(error)
    }
}