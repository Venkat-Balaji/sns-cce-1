import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UserLayout from "../../components/layout/UserLayout";
import JobCard from "../../components/common/JobCard";
import useAuth from "../../hooks/useAuth";
import axios from "../../utils/axios";

const PageContainer = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
  padding: "2rem 0",
});

const SearchContainer = styled(Box)({
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  marginBottom: "2rem",
  padding: "0 2rem",
});

const UserDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("live");
  const { user } = useAuth();

  // Fetch jobs initially and set up refresh interval
  useEffect(() => {
    fetchJobs();
    const refreshInterval = setInterval(fetchJobs, 30000);
    return () => clearInterval(refreshInterval);
  }, [statusFilter]);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `/api/users/jobs-overview/?status=${statusFilter}`
      );
      setJobs(response.data);
      setFilteredJobs(response.data);

      // Extract unique categories from job data
      const uniqueCategories = [...new Set(response.data.map(job => 
        job.company_name
      ))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        if (!user?._id) return;
        const response = await axios.get(`/api/admin/saved-jobs/${user._id}/`);
        setSavedJobs(response.data.map((job) => job._id));
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, [user]);

  // Filter jobs based on search and category
  useEffect(() => {
    let filtered = [...jobs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(query) ||
          job.role_summary?.toLowerCase().includes(query) ||
          job.company_name?.toLowerCase().includes(query) ||
          job.job_location?.toLowerCase().includes(query) ||
          job.required_skills?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((job) => job.company_name === selectedCategory);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, selectedCategory]);

  const handleSaveToggle = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        await axios.post(`/api/users/unsave-job/${jobId}/`, {
          user_id: user._id,
        });
        setSavedJobs(savedJobs.filter((id) => id !== jobId));
      } else {
        await axios.post(`/api/users/save-job/${jobId}/`, {
          user_id: user._id,
        });
        setSavedJobs([...savedJobs, jobId]);
      }
    } catch (error) {
      console.error("Error toggling job save:", error);
    }
  };

  return (
    <UserLayout>
      <PageContainer>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#2c3e50", fontWeight: "600" }}
          >
            Job Listings
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Find your next opportunity
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by title, skills, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="all">All Companies</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="live">Active Jobs</MenuItem>
                <MenuItem value="expired">Expired Jobs</MenuItem>
                <MenuItem value="all">All Jobs</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filteredJobs.length} jobs found
          </Typography>

          <Grid container spacing={3}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <JobCard
                  job={{
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
                    isSaved: savedJobs.includes(job._id),
                    views: job.views || 0
                  }}
                  onSaveToggle={handleSaveToggle}
                />
              </Grid>
            ))}
            {filteredJobs.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary" align="center">
                  No jobs match your criteria
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </PageContainer>
    </UserLayout>
  );
};

export default UserDashboard;
