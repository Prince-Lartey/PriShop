import { createReducer } from "@reduxjs/toolkit";

const initialState = {cart: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],};

export const cartReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("addToCart", (state, action) => {
            const newItem = action.payload;

            // Check if the item already exists in the cart
            const isItemExists = state.cart.findIndex((item) => item._id === newItem._id);

            if (isItemExists !== -1) {
                // Update the existing item in the cart
                state.cart[isItemExists] = newItem;
            } else {
                state.cart.push(newItem);
            }
        })

        .addCase("removeFromCart", (state, action) => {
            const itemId = action.payload;

            // Remove the item with the matching ID
            state.cart = state.cart.filter((item) => item._id !== itemId);
        });
})