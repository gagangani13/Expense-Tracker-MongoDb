import React from "react";
import LOGIN from "./Components/Login/LOGIN";
import { Switch, Route, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Components/Store/store";
import ChangePassword from "./Components/Login/ChangePassword";
import ExpenseForm from "./Components/Welcome/Add/ExpenseForm";
import Leaderboard from "./Components/Welcome/Leaderboard/Leaderboard";
import Downloads from "./Components/Welcome/Downloads/Downloads";
import Header from "./Components/Welcome/Header/Header";
import Chart from "./Components/Welcome/Chart/Chart";
const App = () => {
  return (
    <Provider store={store}>
      <Header/>
      <Switch>
        <Route path="/" exact>
          <LOGIN />
        </Route>
        <Route path="/add" exact>
            <ExpenseForm/>
          </Route>
        <Route path="/chart" exact>
          <Chart />
        </Route>
        <Route path="/leaderboard" exact>
          <Leaderboard />
        </Route>
        <Route path="/downloads" exact>
          <Downloads />
        </Route>
        <Route path="/Password/:Id" exact>
          <ChangePassword />
        </Route>
        <Route path="*">
          <Redirect to="/add" />
        </Route>
      </Switch>
    </Provider>
  );
};

export default App;
