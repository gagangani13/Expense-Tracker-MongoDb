const { INTEGER, STRING } = require('sequelize')
const database=require('../database/database')
module.exports.Order=database.define('order',{
    id:{
        primaryKey:true,
        type:INTEGER,
        autoIncrement:true
    },
    paymentId:STRING,
    orderId:STRING,
    status:STRING
})