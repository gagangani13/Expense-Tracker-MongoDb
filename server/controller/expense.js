const Expense = require("../model/expense");
const User = require("../model/user");

module.exports.addExpense = async (req, res, next) => {
  let { amount, description, category, date,types } = req.body;
  if (!amount || !description || !category || !date|| !types) {
    return res.status(400).send({ message: "Invalid input" });
  }
  if(types!=='Savings'){
    amount=-amount
  }
  try {
    const addExpense = new Expense({
      amount,
      description,
      category,
      date,
      UserId: req.userId,
    });
    const addedExpense = await addExpense.save();
    const getUser = await User.findById(req.userId);
    const totalAmount = Number(getUser.totalExpense) + Number(amount);
    const updateExpense = await getUser.updateOne({ totalExpense: totalAmount });
    try {
      res
        .status(201)
        .send({ message: "Expense added", ok: true, id: addExpense.id });
    } catch (error) {
      throw new Error();
    }
  } catch (error) {
    res.status(200).send({ message: "Expense not added", ok: false });
  }
};

module.exports.getExpenses = async (req, res, next) => {
  try {
    const itemsPerPage = Number(req.query.size) || 2;
    let page = Number(req.query.page);
    const count = await Expense.countDocuments({ UserId: req.userId });
    while (itemsPerPage * (page - 1) >= count && page > 1) {
      page -= 1;
    }
    const offset = itemsPerPage * (page - 1);
    if (offset <= count) {
      const expenses = await Expense.find({ UserId: req.userId })
        .skip(offset)
        .limit(itemsPerPage)
        .sort({ date: -1 });
      res.send({
        ok: true,
        currentPage: page,
        previousPage: page - 1,
        nextPage: expenses.length < itemsPerPage ? 0 : page + 1,
        expenses: expenses,
        lastPage:
          expenses.length < itemsPerPage ? 0 : Math.ceil(count / itemsPerPage),
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Error" });
  }
};

module.exports.deleteExpense=async(req,res,next)=>{
    try {
        const findExpense=await Expense.findById(req.params.Id)
        const findUser=await User.findById(req.userId)
        const removeExpense=Number(findUser.totalExpense)-Number(findExpense.amount)
        const updateUser=await findUser.updateOne({totalExpense:removeExpense})
        const deleteId=await findExpense.deleteOne()
        try {
            res.status(200).send({ok:true,message:'Deleted'})
        } catch (error) {
            throw new Error()
        }
    } catch (error) {
        res.status(500).send({ok:false,message:'failed'})
    }
}

module.exports.editExpense=async(req,res,next)=>{
    try {
        const Id=req.params.Id
        let{amount,description,date,category,types}=req.body
        if(!amount||!description||!date||!category||!types){
            throw new Error('Invalid input')
        }
        if(types!=='Savings'){
          amount=-amount
        }
        const getExpense=await Expense.findById(Id)
        const getUser=await User.findById(getExpense.UserId)
        const oldExpense=Number(getUser.totalExpense)-Number(getExpense.amount)
        const updateExpense=await getExpense.updateOne({
            amount,
            date,
            category,
            description
        })
        const updateUser=await getUser.updateOne({totalExpense:oldExpense+Number(amount)})
        try {
            res.send({message:'Expenses updated',expense:updateExpense,ok:true})
        } catch (error) {
            throw new Error()
        }
    } catch (error) {
        res.status(200).send({message:error.message,ok:false})
    }
}

module.exports.getExpense=async(req,res,next)=>{
    try {
        const Id=req.params.Id
        const getExpense=await Expense.findById(Id)
        console.log(getExpense);
        res.send({message:'Edit expense',expense:getExpense,ok:true})
    } catch (error) {
        res.send({message:'Error',ok:false})
    }
}
