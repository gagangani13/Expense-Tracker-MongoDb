import { useState, useRef, useEffect } from "react";
import BarChart from "./BarChart";
import "./Chart.css";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const Chart = () => {
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const [activeChart, setActiveChart] = useState("bar");
  const [xAxis, setXAxis] = useState([]);
  const [meArray, setMeArray] = useState([]);
  const [familyArray, setFamilyArray] = useState([]);
  const [friendsArray, setFriendsArray] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [amount, setAmount] = useState(0);

  const yearRef = useRef(String);
  const monthRef = useRef(String);

  const token =localStorage.getItem("idToken")
  const premium=useSelector(state=>state.authenticate.activatePremium)
  const login=useSelector(state=>state.authenticate.login)

  const handleChartClick = (chartType) => {
    setActiveChart(chartType);
  };

  async function getData() {
    const response = await axios.get(
      `https://expense-tracker-backend-ndmg.onrender.com/chart?year=${yearRef.current.value}&month=${monthRef.current.value}`,{
        headers: { Authorization: token },
      }
    );
    const data = await response.data;
    try {
      if (!data.ok) {
        throw new Error(data.error);
      }
      setXAxis(data.xAxisArray);
      setMeArray(data.meArray);
      setFamilyArray(data.familyArray);
      setFriendsArray(data.friendsArray);
      setYears(data.uniqueYearsArray);
      setMonths(data.monthsArray);
      const totalSum = [
        ...data.meArray,
        ...data.familyArray,
        ...data.friendsArray,
      ].reduce((acc, curr) => acc + curr, 0);
      setAmount(totalSum);
      yearRef.current.value = data.year;
      monthRef.current.value = data.month;
    } catch (error) {
      console.log(error);
    }
  }

  async function downloadExpenses() {
    const response=await axios.get('https://expense-tracker-backend-ndmg.onrender.com/downloadExpense',{headers: { Authorization: token }})
    const data=await response.data
    try {
      if (!data.ok) {
        throw new Error()
      }
      let url=data.s3Url
      let link=document.createElement('a')
      link.setAttribute('href',url)
      link.setAttribute('download','Expenses.xlsx')
      link.click()
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    {login&&premium&&<motion.div
      initial={{ opacity: 0, x: "-100vw" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100, duration: 1 }}
      className="chartStyle"
    >
      <div className="downloadAndSort">
        {/* <a href={`https://expense-tracker-backend-ndmg.onrender.com/downloadExpense?token=${token}`} download="Expenses.xlsx">
          <i className="fa-solid fa-download fa-lg"></i>
        // when s3 bucket expires use this and remove downloads page</a> */} 
        <i className="fa-solid fa-download fa-lg active" onClick={downloadExpenses}></i>
        <Form className="sorting">
          <Form.Select aria-label="Floating label select example" ref={monthRef}>
            <option value="Month">Month</option>
            {months.map((month) => (
              <option value={month}>{month}</option>
            ))}
          </Form.Select>
          <Form.Select aria-label="Floating label select example" ref={yearRef}>
            <option value="Year">Year</option>
            {years.map((year) => (
              <option value={year}>{year}</option>
            ))}
          </Form.Select>
          <Button type="button" onClick={getData} variant="secondary">
            Show
          </Button>
        </Form>
      </div>
      <h5>
        Expenditures in{" "}
        {`${monthRef.current.value !== "Month" ? monthRef.current.value : ""} ${
          yearRef.current.value !== "Year" ? yearRef.current.value : "Total"
        }`}
      </h5>
      <h4>&#8377; {amount}</h4>
      <div className="chartSize">
        {activeChart === "bar" && (
          <BarChart meArray={meArray} friendsArray={friendsArray} familyArray={familyArray} xAxis={xAxis} />
        )}
        {activeChart === "line" && (
          <LineChart meArray={meArray} friendsArray={friendsArray} familyArray={familyArray} xAxis={xAxis} />
        )}
        {activeChart === "pie" && (
          <PieChart meArray={meArray} friendsArray={friendsArray} familyArray={familyArray} xAxis={xAxis} />
        )}
      </div>
      <div className="chartOptions">
        <i
          className={`fa-solid fa-chart-simple fa-lg ${activeChart === "bar" ? "active" : "inactive"}`}
          onClick={() => handleChartClick("bar")}
        ></i>
        <i
          className={`fa-solid fa-chart-line fa-lg ${activeChart === "line" ? "active" : "inactive"}`}
          onClick={() => handleChartClick("line")}
        ></i>
        <i
          className={`fa-solid fa-chart-pie fa-lg ${activeChart === "pie" ? "active" : "inactive"}`}
          onClick={() => handleChartClick("pie")}
        ></i>
      </div>
    </motion.div>}
    </>
  );
};

export default Chart;
