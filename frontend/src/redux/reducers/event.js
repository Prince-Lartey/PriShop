import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
};

export const eventReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("eventCreateRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("eventCreateSuccess", (state, action) => {
            state.success = true;
            state.isLoading = false;
            state.event = action.payload;
        })
        .addCase("eventCreateFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })
        
        // get all products of shop
        .addCase("getAllEventsShopRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("getAllEventsShopSuccess", (state, action) => {
            state.isLoading = false;
            state.events = action.payload;
        })
        .addCase("getAllEventsShopFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // delete product of a shop
        .addCase("deleteEventsRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("deleteEventsSuccess", (state, action) => {
            state.isLoading = false;
            state.message = action.payload;
        })
        .addCase("deleteEventsFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        .addCase("clearErrors", (state) => {
            state.error = null;
        })
})