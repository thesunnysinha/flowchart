import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFlowcharts } from '../redux/flowchartSlice';
import { MaterialReactTable } from 'material-react-table';
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Container, Box, IconButton, Grid } from '@mui/material';
import { API_BASE_URL } from '../services/apiConfig';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const HomePage = () => {
    const dispatch = useDispatch();
    const flowcharts = useSelector((state) => state.flowchart.flowcharts);
    const navigate = useNavigate();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedFlowchartId, setSelectedFlowchartId] = useState(null);
    const [editFlowchartId, setEditFlowchartId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        // Fetch flowcharts from backend
        axios.get(`${API_BASE_URL}/flowcharts/`)
            .then((response) => dispatch(setFlowcharts(response.data)))
            .catch((error) => console.error('Error fetching flowcharts:', error));
    }, [dispatch]);

    const handleCreate = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/flowcharts/`, {
                title: 'New Flowchart',
            });
            const newFlowchart = response.data;
            navigate(`/flow/${newFlowchart.id}`);
        } catch (error) {
            console.error('Error creating flowchart:', error);
        }
    };

    const handleOpen = (id) => {
        navigate(`/flow/${id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/flowcharts/${selectedFlowchartId}/`);
            dispatch(setFlowcharts(flowcharts.filter(flowchart => flowchart.id !== selectedFlowchartId)));
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting flowchart:', error);
        }
    };

    const handleEdit = async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/flowcharts/${editFlowchartId}/`, {
                title: editTitle,
            });
            const updatedFlowchart = response.data;
            dispatch(setFlowcharts(flowcharts.map(flowchart => flowchart.id === editFlowchartId ? updatedFlowchart : flowchart)));
            setEditFlowchartId(null);
            setEditTitle('');
            setOpenEditDialog(false);
        } catch (error) {
            console.error('Error editing flowchart:', error);
        }
    };

    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'title',
            header: 'Title',
        },
        {
            id: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <Box display="flex" justifyContent="space-between">
                    <IconButton
                        color="secondary"
                        onClick={() => handleOpen(row.original.id)}
                    >
                        <OpenInNewIcon />
                    </IconButton>
                    <IconButton
                        color="primary"
                        onClick={() => {
                            setEditFlowchartId(row.original.id);
                            setEditTitle(row.original.title);
                            setOpenEditDialog(true);
                        }}
                        style={{ marginLeft: '10px' }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => {
                            setSelectedFlowchartId(row.original.id);
                            setOpenDeleteDialog(true);
                        }}
                        style={{ marginLeft: '10px' }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Flowchart Management
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {flowcharts.length > 0 ? (
                        <MaterialReactTable
                            columns={columns}
                            data={flowcharts}
                            enablePagination
                            enableSorting
                            renderTopToolbarCustomActions={() => (
                                <Button variant="contained" color="primary" onClick={handleCreate}>
                                    Create New
                                </Button>
                            )}
                        />
                    ) : (
                        <Typography variant="body1" color="textSecondary" align="center">
                            No flowcharts available. Create one to get started!
                        </Typography>
                    )}
                </Grid>
            </Grid>
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this flowchart?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
            >
                <DialogTitle>Edit Flowchart Title</DialogTitle>
                <DialogContent>
                    <TextField
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        fullWidth
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEdit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default HomePage;