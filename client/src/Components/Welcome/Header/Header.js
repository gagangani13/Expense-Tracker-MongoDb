import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authAction } from "../../Store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect, Route } from "react-router-dom";
import "./Header.css";
import axios from "axios";
import { expenseAction } from "../../Store/expenseSlice";



const navLinkVariant = {
  initial: { scale: 1 },
  whileHover: {
    scale: 1.1,
    fontWeight: "bold",
    transition: { duration: 0.25, type: "tween" },
  },
};

const Header = () => {
  const login = useSelector((state) => state.authenticate.login);
  const idToken = localStorage.getItem("idToken");
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  useEffect(() => {
    if (idToken && userId) {
      dispatch(authAction.loginHandler());
      dispatch(authAction.setToken(idToken));
      dispatch(authAction.setUserId(userId));
      async function verifyPremium() {
        const response = await axios.get(`https://expense-tracker-backend-ndmg.onrender.com/verifyPremium`, {
          headers: { Authorization: idToken },
        });
        const data = await response.data;
        try {
          if (!data.ok) {
            throw new Error();
          }
          dispatch(authAction.setActivatePremium(true));
          localStorage.setItem("premium", true);
        } catch (error) {
          if(data.error==='Token Error'){
            dispatch(authAction.logoutHandler());
          }
          dispatch(authAction.setActivatePremium(false));
          localStorage.setItem("premium", false);
        }
      }
      verifyPremium();
    }
  }, [idToken,userId,dispatch]);
  
  const activatePremium = useSelector(
    (state) => state.authenticate.activatePremium
  );
  const [active, setActive] = useState("nav__menu");
  const [icon, setIcon] = useState("nav__toggler");

  const navToggle = () => {
    if (active === "nav__menu") {
      setActive("nav__menu nav__active");
    } else setActive("nav__menu");

    // Icon Toggler
    if (icon === "nav__toggler") {
      setIcon("nav__toggler toggle");
    } else setIcon("nav__toggler");
  };

  async function activation(e) {
    e.preventDefault();
    if (!activatePremium) {
      const response = await axios.get(
        "https://expense-tracker-backend-ndmg.onrender.com/purchasePremium",
        { headers: { Authorization: idToken } }
      );
      const data = await response.data;
      try {
        var options = {
          //whatever I write here will go to pop up Razorpay
          key: data.key_id,
          orderId: data.order.id,
          amount: data.order.amount,
          handler: async (response) => {
            const response2 = await axios.post(
              "https://expense-tracker-backend-ndmg.onrender.com/updateTransactionStatus",
              {
                orderId: options.orderId,
                paymentId: response.razorpay_payment_id,
              },
              { headers: { Authorization: idToken } }
            );
            try {
              alert(response2.data.message);
              dispatch(authAction.setActivatePremium(true));
              localStorage.setItem("premium", true);
            } catch (error) {
              console.log(error);
            }
          },
        };
      } catch (error) {
        console.log(error);
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else if (activatePremium) {
      localStorage.setItem("activatePremium", false);
      dispatch(expenseAction.setActivatePremium(false));
    }
  }


  function logoutHandler() {
    dispatch(authAction.logoutHandler());
    localStorage.removeItem("idToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("premium");
    localStorage.removeItem("size");
    localStorage.removeItem("currentPage");
  }

  return (
    <>
      {login && (
        <>
          <div className="background" />
          <header>
            <h1>Expense Tracker</h1>
            <motion.div className={active}>
              <motion.span
                variants={navLinkVariant}
                initial="initial"
                whileHover="whileHover"
              >
                <NavLink
                  to="/add"
                  activeClassName="activeLink"
                  className="NavLink"
                  onClick={navToggle}
                >
                  ADD
                </NavLink>
              </motion.span>
              {!activatePremium && (
                <motion.span
                  variants={navLinkVariant}
                  initial="initial"
                  whileHover="whileHover"
                  onClick={activation}
                >
                  <NavLink
                    activeClassName="activeLink"
                    className="NavLink"
                    onClick={navToggle}
                    to="/add"
                  >
                    ACTIVATE PREMIUM
                  </NavLink>
                </motion.span>
              )}
              {activatePremium && (
                <motion.span
                  variants={navLinkVariant}
                  initial="initial"
                  whileHover="whileHover"
                >
                  <NavLink
                    activeClassName="activeLink"
                    className="NavLink"
                    onClick={navToggle}
                    to="/leaderboard"
                  >
                    LEADERBOARD
                  </NavLink>
                </motion.span>
              )}
              {activatePremium && (
                <motion.span
                  variants={navLinkVariant}
                  initial="initial"
                  whileHover="whileHover"
                >
                  <NavLink
                    activeClassName="activeLink"
                    className="NavLink"
                    onClick={navToggle}
                    to="/chart"
                  >
                    CHART
                  </NavLink>
                </motion.span>
              )}
              {activatePremium && (
                <motion.span
                  variants={navLinkVariant}
                  initial="initial"
                  whileHover="whileHover"
                >
                  <NavLink
                    activeClassName="activeLink"
                    className="NavLink"
                    onClick={navToggle}
                    to="/downloads"
                  >
                    DOWNLOADS
                  </NavLink>
                </motion.span>
              )}
              <motion.span
                variants={navLinkVariant}
                initial="initial"
                whileHover="whileHover"
              >
                <NavLink to="/" className="NavLink" onClick={logoutHandler}>
                  LOGOUT
                </NavLink>
              </motion.span>
            </motion.div>
            <div onClick={navToggle} className={icon}>
              <div className="line1"></div>
              <div className="line2"></div>
              <div className="line3"></div>
            </div>
          </header>
        </>
      )}
      {!login&&<Route><Redirect to='/'/></Route>}
    </>
  );
};

export default Header;
