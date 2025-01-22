import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Handle,
    addEdge,
    useNodesInitialized,
} from '@xyflow/react';
import { CircularProgress } from '@mui/material';
import { setSelectedFlowchart, addNode } from '../redux/flowchartSlice';
import { API_BASE_URL } from '../services/apiConfig';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Define initial node types with icons
const initialNodeTypes = {
    decision: ({ id }) => (
        <div style={{ padding: 10, backgroundColor: '#ffcc00', borderRadius: 5 }}>
            <img src="/path/to/decision-icon.png" alt="Decision" style={{ width: 30, height: 30 }} />
            <Handle type="source" position="right" id={`${id}-out`} />
            <Handle type="target" position="left" id={`${id}-in`} />
        </div>
    ),
    process: ({ id }) => (
        <div style={{ padding: 10, backgroundColor: '#00ccff', borderRadius: 5 }}>
            <img src="/path/to/process-icon.png" alt="Process" style={{ width: 30, height: 30 }} />
            <Handle type="source" position="right" id={`${id}-out`} />
            <Handle type="target" position="left" id={`${id}-in`} />
        </div>
    ),
    startEnd: ({ id }) => (
        <div style={{ padding: 10, backgroundColor: '#ff6666', borderRadius: 5 }}>
            <img src="/path/to/start-end-icon.png" alt="Start/End" style={{ width: 30, height: 30 }} />
            <Handle type="source" position="right" id={`${id}-out`} />
            <Handle type="target" position="left" id={`${id}-in`} />
        </div>
    ),
};

const FlowEditor = () => {
    const { flowchartId } = useParams();
    const dispatch = useDispatch();
    const flowchart = useSelector((state) => state.flowchart.selectedFlowchart);
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const nodesInitialized = useNodesInitialized();

    // Function to save flowchart state
    const saveFlowchartState = async () => {
        if (flowchart) {
            try {
                await axios.put(`${API_BASE_URL}/flowcharts/${flowchartId}/`, flowchart);
                console.log('Flowchart saved successfully');
            } catch (error) {
                console.error('Error saving flowchart state:', error);
            }
        }
    };

    // Fetch flowchart on mount
    useEffect(() => {
        const fetchFlowchart = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/flowcharts/${flowchartId}/`);
                dispatch(setSelectedFlowchart(response.data));
            } catch (error) {
                console.error('Error fetching flowchart:', error);
            }
        };

        fetchFlowchart();

        // Auto-save every 5 seconds
        const interval = setInterval(saveFlowchartState, 5000);

        return () => clearInterval(interval);
    }, [dispatch, flowchartId]);

    // Save on Ctrl + S
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                saveFlowchartState();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Handle drop event
    const handleDrop = (event) => {
        event.preventDefault();
        const nodeType = event.dataTransfer.getData('nodeType');

        if (!nodeType || !reactFlowInstance || !reactFlowWrapper.current) {
            return;
        }

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        const newNode = {
            id: String(Date.now()),
            type: nodeType,
            data: { label: `${nodeType} Node` },
            position,
            draggable: true,
        };

        dispatch(addNode(newNode));

        // Ensure viewport fits after adding a node
        if (reactFlowInstance) {
            reactFlowInstance.fitView({ padding: 0.2 });
        }
    };

    // Handle drag over (to allow dropping)
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // Handle manual connections between nodes
    const handleConnect = (params) => {
        dispatch(addNode(addEdge(params)));
    };

    return (
        <div style={{ height: '90vh', display: 'flex' }}>
            {/* Sidebar for Drag-and-Drop */}
            <div
                style={{
                    width: '200px',
                    backgroundColor: '#f0f0f0',
                    padding: 10,
                    borderRadius: 5,
                    marginRight: 20,
                }}
            >
                <h3>Components</h3>
                {['decision', 'process', 'startEnd'].map((type) => (
                    <div
                        key={type}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('nodeType', type)}
                        style={{
                            backgroundColor:
                                type === 'decision'
                                    ? '#ffcc00'
                                    : type === 'process'
                                        ? '#00ccff'
                                        : '#ff6666',
                            padding: '10px',
                            marginBottom: '10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <img src={`/path/to/${type}-icon.png`} alt={type} style={{ width: 20, height: 20, marginRight: 8 }} />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                ))}
            </div>

            {/* React Flow Canvas */}
            <div style={{ flexGrow: 1 }}>


                <ReactFlow
                    nodes={flowchart.nodes}
                    edges={flowchart.edges}
                    onConnect={handleConnect}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    fitView={nodesInitialized}
                    nodeTypes={initialNodeTypes}
                    onInit={(instance) => setReactFlowInstance(instance)}
                >
                    <Background />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
            </div>
        </div>
    );
};

export default FlowEditor;