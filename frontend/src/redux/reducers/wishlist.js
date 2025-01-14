import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    wishlist: localStorage.getItem("wishlistItems") ? JSON.parse(localStorage.getItem("wishlistItems")) : [],
};

export const wishlistReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("addToWishlist", (state, action) => {
            const newItem = action.payload;

            // Check if the item already exists in the wishlist
            const isItemExists = state.wishlist.findIndex((item) => item._id === newItem._id);

            if (isItemExists !== -1) {
                // Update the existing item in the wishlist
                state.wishlist[isItemExists] = newItem;
            } else {
                state.wishlist.push(newItem);
            }
        })

        .addCase("removeFromWishlist", (state, action) => {
            const itemId = action.payload;

            // Remove the item with the matching ID
            state.wishlist = state.wishlist.filter((item) => item._id !== itemId);
        });
})