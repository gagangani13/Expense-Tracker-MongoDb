const { Expense } = require("../model/expense")

const getExpense=(id)=>{
    return Expense.findAll({where:{UserId:id}})
}

module.exports={getExpense}