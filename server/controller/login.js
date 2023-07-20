const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ForgotPassword = require("../model/forgotPassword");
require("dotenv").config();

function userEncrypt(id) {
  return jwt.sign(id, process.env.JWT_SECRET);
}

module.exports.newUser = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ err: "Invalid Input" });
  }
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    bcrypt.hash(password, 10, async (err, result) => {
      if (err) {
        throw new Error();
      }
      const createUser = new User({
        email: email,
        password: result,
        name: name,
        totalExpense: 0,
        premium: false,
      });
      await createUser.save();
      res.status(201).json({ message: "User Added" });
    });
  } catch (error) {
    res.status(500).send({ message: "User Exists" });
  }
};

module.exports.loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(200).send({ message: "Invalid Input", ok: false });
  }
  try {
    const getUser = await User.find({ email: email });
    bcrypt.compare(password, getUser[0].password, (err, result) => {
      if (err) {
        throw new Error("Something went wrong");
      } else if (result) {
        res.status(200).send({
          message: "User Logged in",
          ok: true,
          emailId: getUser[0].email,
          id: getUser[0]._id,
          idToken: userEncrypt(getUser[0].id),
          premium: getUser[0].premium,
        });
      } else {
        res.status(200).send({ message: "Incorrect password", ok: false });
      }
    });
  } catch (error) {
    res.status(200).send({ message: "User doesn't exists", ok: false });
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const Sib = require("sib-api-v3-sdk");
    const Client = Sib.ApiClient.instance;
    const apiKey = Client.authentications["api-key"];
    apiKey.apiKey = process.env.FORGOT_PASSWORD;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "gagangani17@gmail.com",
      name: "Gagan",
    };
    const receiver = [
      {
        email: req.body.email,
      },
    ];
    const transactEmail = await tranEmailApi.sendTransacEmail({
      sender: sender,
      to: receiver,
      subject: "Expense Tracker",
      textContent: "You can change your password here",
      htmlContent: `<div><h1>Hello Boss</h1><a href="https://expense-tracker-backend-ndmg.onrender.com/Password/${req.UUID}">Change your password here</a></div>`,
    });
    try {
      res.send({ ok: true, message: "Email sent" });
    } catch (error) {
      throw new Error();
    }
  } catch (error) {
    res.send({ ok: false, message: "Invalid email id" });
  }
};

module.exports.updatePassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const UUID = req.params.Id;
    if (!password) {
      return res.send({ message: "Invalid Input" });
    }
    bcrypt.hash(password, 10, async (err, result) => {
      if (err) {
        return res.send(err);
      } else if (result) {
        try {
          const findPassword = await ForgotPassword.findOne({ _id: UUID });
          if (findPassword === null) {
            return res.send({ message: "Password change failed", ok: false });
          }
          const findUser = await User.findOne({ _id: findPassword.UserId });
          const updatePassword = await findPassword.updateOne({
            isActive: false,
          });
          const updateUser = await findUser.updateOne({ password: result });
          res.send({ message: "Password changed successfully", ok: true });
        } catch (error) {
          res.send({ message: "Password change failed", ok: false });
        }
      }
    });
  } catch (error) {
    res.send({ message: "Password change failed", ok: false });
  }
};
