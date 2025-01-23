import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Button,
  Grid,
  Stack,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UserLayout from "../../components/layout/UserLayout";
import useAuth from "../../hooks/useAuth";
import axios from "../../utils/axios";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  const fetchJobDetails = useCallback(async () => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }
      const response = await axios.get(`/api/users/jobs/${id}/`, {
        params: { user_id: user._id },
      });
      setJob(response.data);

      // Check if job is saved
      const savedResponse = await axios.get(
        `/api/users/saved-jobs/${user._id}/`
      );
      setIsSaved(savedResponse.data.some((savedJob) => savedJob._id === id));
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  }, [id, navigate, user]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleSaveJob = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      if (isSaved) {
        await axios.post(`/api/users/jobs/${id}/unsave/`, {}, config);
      } else {
        await axios.post(`/api/users/jobs/${id}/save/`, {}, config);
      }

      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
    }
  };

  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.post(`/api/users/jobs/${id}/view/`, {}, config);
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    };

    if (id) {
      incrementViewCount();
    }
  }, [id, user.token]);

  if (!job) return null;

  return (
    <UserLayout>
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {job.title}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                {job.company_name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <VisibilityIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {job.views || 0} views
                </Typography>
              </Box>
            </Box>
            <Tooltip title={isSaved ? "Remove from saved" : "Save job"}>
              <IconButton onClick={handleSaveJob}>
                {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={<LocationOnIcon />}
                label={job.job_location}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={<WorkIcon />}
                label={job.work_type}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={<AccessTimeIcon />}
                label={job.work_schedule}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                icon={<CalendarTodayIcon />}
                label={`Deadline: ${new Date(job.application_deadline).toLocaleDateString()}`}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Company Overview
          </Typography>
          <Typography paragraph>{job.company_overview}</Typography>

          <Typography variant="h6" gutterBottom>
            Role Summary
          </Typography>
          <Typography paragraph>{job.role_summary}</Typography>

          <Typography variant="h6" gutterBottom>
            Key Responsibilities
          </Typography>
          <Typography paragraph>{job.key_responsibilities}</Typography>

          <Typography variant="h6" gutterBottom>
            Requirements
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SchoolIcon color="action" />
              <Typography>
                <strong>Education:</strong> {job.education_requirements}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WorkIcon color="action" />
              <Typography>
                <strong>Experience:</strong> {job.experience_level}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Required Skills:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {job.required_skills.split(',').map((skill, index) => (
                  <Chip key={index} label={skill.trim()} size="small" />
                ))}
              </Box>
            </Box>
          </Stack>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Compensation & Benefits
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MonetizationOnIcon color="action" />
              <Typography>
                <strong>Salary Range:</strong> {job.salary_range}
              </Typography>
            </Box>
            <Typography paragraph>{job.benefits}</Typography>
          </Stack>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            How to Apply
          </Typography>
          <Typography paragraph>{job.application_instructions}</Typography>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Contact Information
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmailIcon color="action" />
              <Typography>{job.contact_email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PhoneIcon color="action" />
              <Typography>{job.contact_phone}</Typography>
            </Box>
          </Stack>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href={job.application_instructions}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
            </Button>
          </Box>
        </Paper>
      </Box>
    </UserLayout>
  );
};

export default JobDetails;
