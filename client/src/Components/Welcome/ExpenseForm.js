import React, { useEffect, useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { expenseAction } from "../Store/expenseSlice";
import "./expenseForm.css";
import axios from "axios";
import Paginate from "./Paginate";
import { motion } from "framer-motion";
import Loader from "./Loader";
import DateFormat from "./DateFormat";

var pageData = {};
var pageSize = localStorage.getItem("size") || 2;
var currPage = localStorage.getItem("currentPage") || 1;
const ExpenseForm = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenseList.expenses);
  const editing = useSelector((state) => state.expenseList.editing);
  const userId = useSelector((state) => state.authenticate.userId);
  const token = useSelector((state) => state.authenticate.idToken);
  const [load, setLoad] = useState(false);
  const amountRef = useRef();
  const descriptionRef = useRef();
  const categoryRef = useRef();
  const dateRef = useRef();
  useEffect(() => {
    console.log(currPage, pageSize);
    document.getElementById("pageSize").value = pageSize;
    getExpenses(currPage, pageSize);
    // eslint-disable-next-line
  }, []);

  async function getExpenses(currPage = 1, size = 2) {
    const token = localStorage.getItem("idToken");
    const response = await axios.get(
      `https://expense-tracker-backend-ndmg.onrender.com/getExpenses?page=${currPage}&size=${size}`,
      {
        headers: { Authorization: token },
      }
    );
    const data = await response.data;
    try {
      if (data.ok) {
        localStorage.setItem("currentPage", currPage);
        localStorage.setItem("size", size);
        pageData = data;
        pageSize = size;
        currPage = data.currentPage;
        let arr = [];
        const expense = data.expenses;
        for (const item in expense) {
          arr.push({
            amount: expense[item].amount,
            description: expense[item].description,
            category: expense[item].category,
            expenseId: expense[item]._id,
            date: expense[item].date,
          });
        }
        dispatch(expenseAction.reloadExpense(arr));
      } else {
        throw new Error();
      }
    } catch (error) {
      alert(data.error.message);
    }
  }
  async function addExpenses(e) {
    e.preventDefault();
    setLoad(true);
    let details = {
      amount: amountRef.current.value,
      description: descriptionRef.current.value,
      category: categoryRef.current.value,
      date: dateRef.current.value,
    };
    if (editing === null) {
      const response = await axios.post(
        "https://expense-tracker-backend-ndmg.onrender.com/addExpense",
        details,
        { headers: { Authorization: token } }
      );
      const data = await response.data;
      try {
        setLoad(false);
        if (data.ok) {
          details = { ...details, expenseId: data.id };
          emptyForm();
          dispatch(expenseAction.loadExpenses(details));
          getExpenses(1, pageSize);
        } else {
          throw new Error();
        }
      } catch (error) {
        alert(data.error.message);
      }
    } else {
      const response = await axios.put(
        `https://expense-tracker-backend-ndmg.onrender.com/editExpense/${editing}`,
        details
      );
      const data = await response.data;
      try {
        setLoad(false);
        if (data.ok) {
          const editArray = expenses.map((item) => {
            console.log(item.expenseId, editing);
            if (item.expenseId === (editing)) {
              return {
                expenseId: editing,
                amount: amountRef.current.value,
                description: descriptionRef.current.value,
                category: categoryRef.current.value,
                date: dateRef.current.value,
              };
            }
            return item;
          });
          dispatch(expenseAction.reloadExpense(editArray));
          dispatch(expenseAction.editExpense(null));
        } else {
          throw new Error();
        }
      } catch (error) {
        alert(data.message);
      }
      emptyForm();
    }
  }
  async function deleteExpense(e) {
    setLoad(true);
    const key = e.target.parentElement.id;
    console.log(userId, key);
    const response = await axios.delete(
      `https://expense-tracker-backend-ndmg.onrender.com/deleteExpense/${key}`,
      { headers: { Authorization: token } }
    );
    const data = await response.data;
    try {
      console.log(data);
      setLoad(false);
      if (data.ok) {
        getExpenses(currPage,pageSize)
      } else {
        throw new Error();
      }
    } catch (error) {
      alert(data.error.message);
    }
  }
  async function editExpense(e) {
    setLoad(true);
    const key = e.target.parentElement.id;
    const response = await axios.get(`https://expense-tracker-backend-ndmg.onrender.com/getExpense/${key}`);
    const data = await response.data;
    try {
      setLoad(false);
      if (data.ok) {
        amountRef.current.value = data.expense.amount;
        descriptionRef.current.value = data.expense.description;
        categoryRef.current.value = data.expense.category;
        dateRef.current.value = data.expense.date;
        dispatch(expenseAction.editExpense(key));
      } else {
        throw new Error();
      }
    } catch (error) {
      alert(data.message);
    }
  }
  function emptyForm() {
    amountRef.current.value = "";
    descriptionRef.current.value = "";
    categoryRef.current.value = "";
    dateRef.current.value = "";
  }
  function cancelUpdate() {
    emptyForm();
    dispatch(expenseAction.editExpense(null));
  }
  return (
    <motion.div
      className="welcomeLayout"
      initial={{ opacity: 0, x: "-100vw" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <h3>ADD EXPENSES</h3>
      <Form className="form" onSubmit={addExpenses}>
        <Form.Control
          placeholder="Amount"
          type="number"
          ref={amountRef}
          required
        />

        <Form.Control
          placeholder="Description"
          type="text"
          ref={descriptionRef}
          required
        />

        <Form.Control
          type="date"
          name="dob"
          placeholder="Date of Expense"
          ref={dateRef}
          required
        />

        <Form.Select defaultValue="Me" ref={categoryRef} required>
          <option>Me</option>
          <option>Family</option>
          <option>Friends</option>
        </Form.Select>

        <Button variant="dark" type="submit">
          {editing === null ? "ADD" : "UPDATE"}
        </Button>
        {editing !== null && (
          <Button variant="danger" type="button" onClick={cancelUpdate}>
            CANCEL
          </Button>
        )}
      </Form>
      <>
        {load && <Loader />}
        {editing === null &&
          expenses.map((item) => {
            console.log(item);
            return (
              <motion.li
                id={item.expenseId}
                className="expenseItem"
                initial={{ scale: 1 }}
                whileHover={{ x: 0, scale: 1.1 }}
                transition={{ type: "just", stiffness: 20 }}
              >
                <DateFormat date={new Date(item.date)} />
                <span>Rs.{item.amount} </span>
                <span>{item.description} </span>
                <span>{item.category}</span>

                <button onClick={editExpense} class="fa-solid fa-pen button"></button>
                <button
                  onClick={deleteExpense}
                  class="fa-solid fa-trash-can button"
                  style={{ color: "red" }}
                ></button>
              </motion.li>
            );
          })}
        {expenses.length === 0 && (
          <motion.h3
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            }}
          >
            No expenses to show
          </motion.h3>
        )}
      </>
      <Paginate
        data={pageData}
        onChangePage={getExpenses}
        onChangeSize={getExpenses}
      />
    </motion.div>
  );
};

export default ExpenseForm;
