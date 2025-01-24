import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Alert,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../utils/axios";
import useAuth from "../../hooks/useAuth";
import AddStudyMaterialForm from "../../components/forms/AddStudyMaterialForm";
import EditStudyMaterialForm from "../../components/forms/EditStudyMaterialForm";

const StudyMaterialsTable = () => {
  const [materials, setMaterials] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { user } = useAuth();

  const fetchMaterials = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get("/api/users/admin/study-materials/", config);
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching study materials:", error);
      showSnackbar("Error fetching study materials", "error");
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAddSuccess = () => {
    setOpenAddDialog(false);
    fetchMaterials();
    showSnackbar("Study material added successfully");
  };

  const handleEditSuccess = () => {
    setOpenEditDialog(false);
    fetchMaterials();
    showSnackbar("Study material updated successfully");
  };

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setOpenEditDialog(true);
  };

  const handleDelete = (material) => {
    setSelectedMaterial(material);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`/api/users/study-materials/${selectedMaterial._id}/`, config);
      setOpenDeleteDialog(false);
      fetchMaterials();
      showSnackbar("Study material deleted successfully");
    } catch (error) {
      console.error("Error deleting study material:", error);
      showSnackbar("Error deleting study material", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6">Study Materials</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Material
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Conducting Body</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material._id}>
                <TableCell>{material.title}</TableCell>
                <TableCell>{material.type}</TableCell>
                <TableCell>{material.category}</TableCell>
                <TableCell>{material.conductingBody}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(material)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(material)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <AddStudyMaterialForm
            onClose={() => setOpenAddDialog(false)}
            onSuccess={handleAddSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <EditStudyMaterialForm
            material={selectedMaterial}
            onClose={() => setOpenEditDialog(false)}
            onSuccess={handleEditSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Study Material</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{selectedMaterial?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudyMaterialsTable;
