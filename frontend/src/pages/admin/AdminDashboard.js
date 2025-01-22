import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import useAuth from "../../hooks/useAuth";
import axios from "../../utils/axios";
import AddStudyMaterialForm from "../../components/forms/AddStudyMaterialForm";
import StudyMaterialsTable from "./StudyMaterialsTable";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    company_overview: "",
    description: "",
    required_skills: "",
    education_requirements: "",
    experience_level: "",
    salary_range: "",
    benefits: "",
    location: "",
    work_schedule: "",
    contact_email: "",
    contact_phone: "",
    end_date: "",
    application_link: "",
    job_type: "Full-time",
    vacancies: "",
  });
  
  const [openAddMaterial, setOpenAddMaterial] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchJobs = useCallback(async () => {
    try {
      const response = await axios.get("/api/users/jobs-overview/?status=live");
      setJobs(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch jobs. Please try again later.");
    }
  }, []);

  useEffect(() => {
    if (!user || user.user_type !== "admin") {
      navigate("/login");
      return;
    }
    fetchJobs();
  }, [user, navigate, fetchJobs]);

  const handleOpenDialog = (job = null) => {
    if (job) {
      setSelectedJob(job);
      setFormData({
        title: job.title || "",
        department: job.department || "",
        category: job.category || "",
        location: job.location || "",
        description: job.description || "",
        eligibility: job.eligibility || "",
        selection_process: job.selection_process || "",
        pay_scale: job.pay_scale || "",
        end_date: job.end_date?.split("T")[0] || "",
        application_link: job.application_link || "",
        job_type: job.job_type || "Full-time",
        vacancies: job.vacancies || "",
        notification_pdf: job.notification_pdf || "",
      });
    } else {
      setSelectedJob(null);
      setFormData({
        title: "",
        department: "",
        category: "",
        location: "",
        description: "",
        eligibility: "",
        selection_process: "",
        pay_scale: "",
        end_date: "",
        application_link: "",
        job_type: "Full-time",
        vacancies: "",
        notification_pdf: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        status: "live",
      };

      if (selectedJob) {
        await axios.put(`/api/admin/jobs/${selectedJob._id}/`, submitData);
      } else {
        await axios.post("/api/admin/jobs/", submitData);
      }
      fetchJobs();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving job:", error);
      setError("Failed to save job. Please try again later.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`/api/admin/jobs/${jobId}/`);
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
        setError("Failed to delete job. Please try again later.");
      }
    }
  };

  const handleTogglePin = async (jobId) => {
    try {
      await axios.post(`/api/admin/jobs/${jobId}/toggle-pin/`);
      fetchJobs();
    } catch (error) {
      console.error("Error toggling pin status:", error);
      setError("Failed to toggle pin status. Please try again later.");
    }
  };

  const handleAddMaterialSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AdminLayout>
      <Container>
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="h6" gutterBottom>
              Welcome, {user?.name}!
            </Typography>
          </Paper>

          {error && (
            <Paper sx={{ p: 3, mb: 3, backgroundColor: "error.main", color: "white" }}>
              <Typography variant="body1">{error}</Typography>
            </Paper>
          )}

          {/* Jobs Management Section */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6">Manage Jobs</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add New Job
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Vacancies</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <TableRow key={job._id}>
                        <TableCell>
                          <IconButton
                            onClick={() => handleTogglePin(job._id)}
                            color={job.pinned ? "primary" : "default"}
                          >
                            {job.pinned ? (
                              <PushPinIcon />
                            ) : (
                              <PushPinOutlinedIcon />
                            )}
                          </IconButton>
                          {job.title}
                        </TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>{job.category}</TableCell>
                        <TableCell>{job.vacancies}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                          {new Date(job.end_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{job.status}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpenDialog(job)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteJob(job._id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No jobs available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Add/Edit Job Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {selectedJob ? "Edit Job" : "Add New Job"}
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <TextField
                    name="company_name"
                    label="Company Name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                  <TextField
                    name="company_overview"
                    label="Company Overview"
                    value={formData.company_overview}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    fullWidth
                    required
                  />
                  <TextField
                    name="required_skills"
                    label="Required Skills"
                    value={formData.required_skills}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    fullWidth
                  />
                  <TextField
                    name="education_requirements"
                    label="Education Requirements"
                    value={formData.education_requirements}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name="experience_level"
                    label="Experience Level"
                    value={formData.experience_level}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name="salary_range"
                    label="Salary Range"
                    value={formData.salary_range}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name="benefits"
                    label="Benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    fullWidth
                  />
                  <TextField
                    name="work_schedule"
                    label="Work Schedule"
                    value={formData.work_schedule}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    name="contact_email"
                    label="Contact Email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                  <TextField
                      name="application_link"
                      label="Application Link"
                      value={formData.application_link}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />

                  <TextField
                    name="contact_phone"
                    label="Contact Phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    fullWidth
                  />

              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                {selectedJob ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Study Materials Section */}
          <Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Study Materials</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenAddMaterial(true)}
              >
                ADD STUDY MATERIAL
              </Button>
            </Box>
            <StudyMaterialsTable refreshTrigger={refreshTrigger} />
          </Box>

          {/* Add Study Material Dialog */}
          <Dialog
            open={openAddMaterial}
            onClose={() => setOpenAddMaterial(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogContent>
              <AddStudyMaterialForm
                onClose={() => setOpenAddMaterial(false)}
                onSuccess={handleAddMaterialSuccess}
              />
            </DialogContent>
          </Dialog>
        </Box>
      </Container>
    </AdminLayout>
  );
};
export default AdminDashboard;
