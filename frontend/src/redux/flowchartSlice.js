import { createSlice } from '@reduxjs/toolkit';

// Initial state for the flowchart slice
const initialState = {
    flowcharts: [], // Stores all flowcharts
    selectedFlowchart: null, // Currently selected flowchart
};

// Create a slice for flowchart actions and state
const flowchartSlice = createSlice({
    name: 'flowchart',
    initialState,
    reducers: {
        setFlowcharts: (state, action) => {
            state.flowcharts = action.payload; // Correctly updates the list of flowcharts
        },
        setSelectedFlowchart: (state, action) => {
            state.selectedFlowchart = action.payload; // Correctly sets the selected flowchart
        },
        addNode: (state, action) => {
            state.selectedFlowchart.nodes.push(action.payload); // Correctly adds a node
        },
        addEdge: (state, action) => {
            state.selectedFlowchart.edges.push(action.payload); // Correctly adds an edge
        },
        deleteNode: (state, action) => {
            // Correctly filters out the deleted node and its associated edges
            state.selectedFlowchart.nodes = state.selectedFlowchart.nodes.filter(
                (node) => node.id !== action.payload
            );
            state.selectedFlowchart.edges = state.selectedFlowchart.edges.filter(
                (edge) => edge.source !== action.payload && edge.target !== action.payload
            );
        },
        deleteEdge: (state, action) => {
            // Correctly filters out the deleted edge
            state.selectedFlowchart.edges = state.selectedFlowchart.edges.filter(
                (edge) => edge.id !== action.payload
            );
        },
    },
});

// Exporting actions for use in components
export const {
    setFlowcharts,
    setSelectedFlowchart,
    addNode,
    addEdge,
    deleteNode,
    deleteEdge,
} = flowchartSlice.actions;

// Exporting reducer to be used in store configuration
export default flowchartSlice.reducer;
