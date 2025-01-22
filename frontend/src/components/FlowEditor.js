import React, { useEffect, useCallback, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from '@xyflow/react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../services/apiConfig';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import Box from '@mui/material/Box'; // Import Box for layout
import Button from '@mui/material/Button'; // Import Button component
import { Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import '@xyflow/react/dist/style.css';

export default function App() {
    const { flowchartId } = useParams();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false); // For tracking saving state

    // Fetch flowchart data from the backend
    useEffect(() => {
        if (flowchartId) {
            const fetchFlowchart = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/flowcharts/${flowchartId}/`);
                    console.log('Flowchart fetched:', response.data);
                    setNodes(response.data.data.nodes);
                    setEdges(response.data.data.edges);
                    setTitle(response.data.title || 'Untitled Flowchart');
                } catch (error) {
                    console.error('Error fetching flowchart:', error);
                }
            };
            fetchFlowchart();
        }
    }, [flowchartId, setNodes, setEdges]);

    // Add a new node
    const addNode = () => {
        const newNode = {
            id: `node-${nodes.length + 1}`,
            data: { label: `Node ${nodes.length + 1}` },
            position: { x: Math.random() * 250, y: Math.random() * 250 },
        };
        setNodes((prevNodes) => [...prevNodes, newNode]);
    };

    // Save flowchart state
    const saveFlowchartState = useCallback(async () => {
        if (flowchartId) {
            setIsSaving(true); // Start spinner
            try {
                await axios.put(`${API_BASE_URL}/flowcharts/${flowchartId}/`, {
                    data: { nodes, edges },
                    title: title || 'Untitled Flowchart',
                });
                console.log('Flowchart saved successfully');
                setIsSaving(false);
            } catch (error) {
                console.error('Error saving flowchart state:', error);
                setIsSaving('Error Saving');
            } finally {
                setTimeout(() => {
                    setIsSaving(false); // Stop spinner
                }, 2000); // Clear the notification after 2 seconds
            }
        } else {
            console.error('Cannot save flowchart: flowchartId is missing.');
        }
    }, [flowchartId, nodes, edges, title]);

    // Auto-save every 5 seconds
    useEffect(() => {
        const interval = setInterval(saveFlowchartState, 5000);
        return () => clearInterval(interval); // Cleanup
    }, [saveFlowchartState]);

    // Handle connections with animation and random colors
    const onConnect = useCallback(
        (params) => {
            const animatedEdge = {
                ...params,
                animated: true, // Enable animation
                style: {
                    stroke: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color for edge
                },
            };
            setEdges((eds) => addEdge(animatedEdge, eds));
        },
        [setEdges]
    );

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
    }, [saveFlowchartState]);

    // Save when the user leaves the page (beforeunload)
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = ''; // Required for modern browsers to trigger the prompt
            saveFlowchartState();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [saveFlowchartState]);

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {/* Add Node Button */}
            <Button
                variant="contained"
                color="primary"
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 1000,
                    borderRadius: '8px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s',
                }}
                onClick={addNode}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1565c0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#1976d2'}
            >
                Add Node
            </Button>

            {/* Top-center notification */}
            <Box
                sx={{
                    position: 'fixed',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    zIndex: 1000,
                    display: title ? 'flex' : 'none',
                    alignItems: 'center',
                }}
            >
                <strong style={{ marginRight: '8px' }}>{title}</strong>
                {isSaving && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ marginRight: '8px' }}>
                            Saving...
                        </Typography>
                        <CircularProgress
                            size={20}
                            sx={{ color: 'green', marginRight: '8px' }}
                        />
                    </Box>
                )}
            </Box>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                style={{ height: '100%', width: '100%' }}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>

            {/* Table for nodes and edges */}
            <TableContainer component={Paper} style={{ marginTop: '20px', maxWidth: '80%', margin: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Node ID</TableCell>
                            <TableCell>Label</TableCell>
                            <TableCell>Position (X, Y)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {nodes.map((node) => (
                            <TableRow key={node.id}>
                                <TableCell>{node.id}</TableCell>
                                <TableCell>{node.data.label}</TableCell>
                                <TableCell>{`(${node.position.x.toFixed(2)}, ${node.position.y.toFixed(2)})`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
