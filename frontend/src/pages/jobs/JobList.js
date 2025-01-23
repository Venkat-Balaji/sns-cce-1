import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  Work,
  Schedule,
  School,
  Timer,
  MonetizationOn,
  BusinessCenter,
  CalendarToday,
} from '@mui/icons-material';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/users/jobs-overview/?status=live');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
    }
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Job Positions
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {job.company_name}
                    </Typography>
                  </Box>
                  <Chip
                    label={job.work_type}
                    color={
                      job.work_type === 'remote' 
                        ? 'success' 
                        : job.work_type === 'hybrid' 
                        ? 'warning' 
                        : 'info'
                    }
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Company Overview
                        </Typography>
                        <Typography>{job.company_overview}</Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Role Summary
                        </Typography>
                        <Typography>{job.role_summary}</Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Key Responsibilities
                        </Typography>
                        <Typography>{job.key_responsibilities}</Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn color="action" />
                        <Typography>{job.job_location}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Work color="action" />
                        <Typography>{job.experience_level}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule color="action" />
                        <Typography>{job.work_schedule}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <School color="action" />
                        <Typography>{job.education_requirements}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MonetizationOn color="action" />
                        <Typography>{job.salary_range}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday color="action" />
                        <Typography>
                          Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1}>
                    {job.required_skills.split(',').map((skill, index) => (
                      <Chip key={index} label={skill.trim()} size="small" />
                    ))}
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewDetails(job._id)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default JobList; 