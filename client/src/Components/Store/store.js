import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { expenseReducer } from "./expenseSlice";
const store=configureStore({
    reducer:{authenticate:authReducer,expenseList:expenseReducer}
})
export default store;