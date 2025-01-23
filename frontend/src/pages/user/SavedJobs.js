import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Alert } from "@mui/material";
import UserLayout from "../../components/layout/UserLayout";
import JobCard from "../../components/common/JobCard";
import useAuth from "../../hooks/useAuth";
import axios from "../../utils/axios";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchSavedJobs = useCallback(async () => {
    try {
      if (!user?._id) return;
      const response = await axios.get(`/api/users/saved-jobs/${user._id}/`);
      // Transform the data to match JobCard requirements
      const transformedJobs = response.data.map(job => ({
        _id: job._id,
        title: job.title,
        company_name: job.company_name,
        job_location: job.job_location,
        work_type: job.work_type,
        work_schedule: job.work_schedule,
        experience_level: job.experience_level,
        salary_range: job.salary_range,
        application_deadline: job.application_deadline,
        role_summary: job.role_summary,
        required_skills: job.required_skills,
        views: job.views || 0,
        isSaved: true
      }));
      setSavedJobs(transformedJobs);
      setError(null);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      setError("Failed to fetch saved jobs. Please try again later.");
    }
  }, [user?._id]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchSavedJobs();
  }, [user, navigate, fetchSavedJobs]);

  const handleUnsaveJob = async (jobId) => {
    try {
      await axios.post(`/api/users/jobs/${jobId}/unsave/`, {
        user_id: user._id,
      });
      // Remove the unsaved job from the list
      setSavedJobs(savedJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error("Error unsaving job:", error);
      setError("Failed to unsave job. Please try again later.");
    }
  };

  return (
    <UserLayout>
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ color: "#2c3e50", fontWeight: "600" }}
        >
          Saved Jobs
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage your bookmarked positions
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {savedJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job._id}>
              <JobCard
                job={job}
                onSaveToggle={handleUnsaveJob}
              />
            </Grid>
          ))}
          {savedJobs.length === 0 && (
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  backgroundColor: 'background.paper',
                  borderRadius: 1
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No saved jobs yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bookmark jobs you're interested in to view them here
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </UserLayout>
  );
};

export default SavedJobs;
