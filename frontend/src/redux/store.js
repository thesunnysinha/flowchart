import { configureStore } from '@reduxjs/toolkit';
import flowchartReducer from './flowchartSlice';

const store = configureStore({
    reducer: {
        flowchart: flowchartReducer,
    },
});

export default store;
