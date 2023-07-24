import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Leaderboard.css";
import { motion } from "framer-motion";
import { convertToShortNumber } from "../Add/ExpenseForm";
import { useSelector } from "react-redux";
const Leaderboard = () => {
  const [expenses, loadExpenses] = useState([]);
  const idToken = localStorage.getItem("idToken");
  const premium=useSelector(state=>state.authenticate.activatePremium)
  const login=useSelector(state=>state.authenticate.login)
  async function leaderboardExpenses() {
    const response = await axios.get("https://expense-tracker-backend-ndmg.onrender.com/allExpenses", {
      headers: { Authorization: idToken },
    });
    const data = await response.data.expenses;
    try {
      let arr = [];
      for (let element in data) {
        arr.push({
          name: data[element].name,
          totalExpense: data[element].totalExpense
            ? data[element].totalExpense
            : 0,
          order: Number(element) + 1,
        });
      }
      loadExpenses(arr);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    leaderboardExpenses();
    // eslint-disable-next-line
  }, []);
  return (
    <>
   { login&&premium&&<motion.div
      id="leaderboard"
      initial={{ opacity: 0, x: "-100vw" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100, duration: 1 }}
    >
      <h1 id="leaderH1">Leaderboard</h1>
      <li id="listItem">
        <span id="spanLeaderboard">Rank</span>
        <span id="spanLeaderboard">User</span>
        <span id="spanLeaderboard">&#8377;</span>
      </li>
      {expenses.map((item) => {
        return (
          <motion.li
            id="listItem"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "just" }}
          >
            <span id="spanLeaderboard">{item.order}</span>
            <span id="spanLeaderboard">{item.name}</span>
            <span id="spanLeaderboard">{convertToShortNumber(item.totalExpense)}</span>
          </motion.li>
        );
      })}
    </motion.div>}
    </>
  );
};

export default Leaderboard;
