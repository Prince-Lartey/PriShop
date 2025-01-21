import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
};

export const orderReducer = createReducer(initialState, (builder) => {
    builder
        // get all orders of user
        .addCase("getAllOrdersUserRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("getAllOrdersUserSuccess", (state, action) => {
            state.isLoading = false;
            state.orders = action.payload;
        })
        .addCase("getAllOrdersUserFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase("clearErrors", (state) => {
            state.error = null;
        })
})