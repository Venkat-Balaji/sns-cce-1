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
    role_summary: "",
    key_responsibilities: "",
    required_skills: "",
    education_requirements: "",
    experience_level: "",
    salary_range: "",
    benefits: "",
    job_location: "",
    work_type: "on-site",
    work_schedule: "",
    application_instructions: "",
    application_deadline: "",
    contact_email: "",
    contact_phone: ""
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
        company_name: job.company_name || "",
        company_overview: job.company_overview || "",
        role_summary: job.role_summary || "",
        key_responsibilities: job.key_responsibilities || "",
        required_skills: job.required_skills || "",
        education_requirements: job.education_requirements || "",
        experience_level: job.experience_level || "",
        salary_range: job.salary_range || "",
        benefits: job.benefits || "",
        job_location: job.job_location || "",
        work_type: job.work_type || "on-site",
        work_schedule: job.work_schedule || "",
        application_instructions: job.application_instructions || "",
        application_deadline: job.application_deadline?.split('T')[0] || "",
        contact_email: job.contact_email || "",
        contact_phone: job.contact_phone || ""
      });
    } else {
      setSelectedJob(null);
      setFormData({
        title: "",
        company_name: "",
        company_overview: "",
        role_summary: "",
        key_responsibilities: "",
        required_skills: "",
        education_requirements: "",
        experience_level: "",
        salary_range: "",
        benefits: "",
        job_location: "",
        work_type: "on-site",
        work_schedule: "",
        application_instructions: "",
        application_deadline: "",
        contact_email: "",
        contact_phone: ""
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
        title: formData.title,
        company_name: formData.company_name,
        company_overview: formData.company_overview,
        role_summary: formData.role_summary,
        key_responsibilities: formData.key_responsibilities,
        required_skills: formData.required_skills,
        education_requirements: formData.education_requirements,
        experience_level: formData.experience_level,
        salary_range: formData.salary_range,
        benefits: formData.benefits,
        job_location: formData.job_location,
        work_type: formData.work_type,
        work_schedule: formData.work_schedule,
        application_instructions: formData.application_instructions,
        application_deadline: formData.application_deadline,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone
      };

      if (selectedJob) {
        await axios.put(`/api/admin/jobs-api/${selectedJob._id}/`, submitData);
      } else {
        await axios.post("/api/admin/jobs-api/", submitData);
      }
      
      fetchJobs();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving job:", error);
      setError(error.response?.data?.error || "Failed to save job. Please try again later.");
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
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
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
                    <TableCell>Job Title</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Work Type</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Deadline</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job._id}>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.company_name}</TableCell>
                      <TableCell>{job.job_location}</TableCell>
                      <TableCell>{job.work_type}</TableCell>
                      <TableCell>{job.experience_level}</TableCell>
                      <TableCell>
                        {job.application_deadline 
                          ? new Date(job.application_deadline).toLocaleDateString() 
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDialog(job)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteJob(job._id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
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
                {/* Basic Information */}
                <Typography variant="subtitle1" gutterBottom>Basic Information</Typography>
                <TextField
                  name="title"
                  label="Job Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
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

                {/* Job Details */}
                <Typography variant="subtitle1" gutterBottom>Job Details</Typography>
                <TextField
                  name="role_summary"
                  label="Role Summary"
                  value={formData.role_summary}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  fullWidth
                  required
                />
                <TextField
                  name="key_responsibilities"
                  label="Key Responsibilities"
                  value={formData.key_responsibilities}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  fullWidth
                  required
                />

                {/* Requirements */}
                <Typography variant="subtitle1" gutterBottom>Requirements</Typography>
                <TextField
                  name="required_skills"
                  label="Required Skills"
                  value={formData.required_skills}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  fullWidth
                  required
                />
                <TextField
                  name="education_requirements"
                  label="Education Requirements"
                  value={formData.education_requirements}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  name="experience_level"
                  label="Experience Level"
                  value={formData.experience_level}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />

                {/* Compensation */}
                <Typography variant="subtitle1" gutterBottom>Compensation</Typography>
                <TextField
                  name="salary_range"
                  label="Salary Range"
                  value={formData.salary_range}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  name="benefits"
                  label="Benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  fullWidth
                  required
                />

                {/* Location & Schedule */}
                <Typography variant="subtitle1" gutterBottom>Location & Schedule</Typography>
                <TextField
                  name="job_location"
                  label="Job Location"
                  value={formData.job_location}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  select
                  name="work_type"
                  label="Work Type"
                  value={formData.work_type}
                  onChange={handleInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value="remote">Remote</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                  <MenuItem value="on-site">On-Site</MenuItem>
                </TextField>
                <TextField
                  name="work_schedule"
                  label="Work Schedule"
                  value={formData.work_schedule}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />

                {/* Application Details */}
                <Typography variant="subtitle1" gutterBottom>Application Details</Typography>
                <TextField
                  name="application_instructions"
                  label="Application Instructions"
                  value={formData.application_instructions}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  fullWidth
                  required
                />
                <TextField
                  name="application_deadline"
                  label="Application Deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />

                {/* Contact Information */}
                <Typography variant="subtitle1" gutterBottom>Contact Information</Typography>
                <TextField
                  name="contact_email"
                  label="Contact Email"
                  type="email"
                  value={formData.contact_email}
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
                  required
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
