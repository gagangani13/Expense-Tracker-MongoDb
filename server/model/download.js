const { INTEGER, STRING, DATE } = require('sequelize')
const database=require('../database/database')
module.exports.Download=database.define('download',{
    id:{
        type:INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    downloadLink:{
        type:STRING,
        allowNull:false,
        unique:true
    },
    date:{
        type:DATE,
        allowNull:false
    }
})