import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  BusinessCenter as BusinessIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Visibility as VisibilityIcon,
  MonetizationOn as SalaryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, onSaveToggle }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/jobs/${job._id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 6,
          cursor: 'pointer'
        }
      }}
      onClick={handleClick}
    >
      <CardContent>
        {/* Header with Title and Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {job.title}
          </Typography>
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              onSaveToggle(job._id);
            }}
            size="small"
          >
            {job.isSaved ? (
              <BookmarkIcon color="primary" />
            ) : (
              <BookmarkBorderIcon />
            )}
          </IconButton>
        </Box>

        {/* Company Name */}
        <Typography 
          variant="subtitle1" 
          color="primary" 
          gutterBottom 
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <BusinessIcon fontSize="small" />
          {job.company_name}
        </Typography>

        {/* Job Details with Icons */}
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2">{job.job_location}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkIcon fontSize="small" color="action" />
            <Typography variant="body2">{job.work_type}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon fontSize="small" color="action" />
            <Typography variant="body2">{job.work_schedule}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SalaryIcon fontSize="small" color="action" />
            <Typography variant="body2">{job.salary_range}</Typography>
          </Box>
        </Stack>

        {/* Skills */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Required Skills:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {job.required_skills?.split(',').map((skill, index) => (
              <Chip
                key={index}
                label={skill.trim()}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Box>
        </Box>

        {/* Footer with Views and Deadline */}
        <Box 
          sx={{ 
            mt: 2, 
            pt: 2, 
            borderTop: 1, 
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VisibilityIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {job.views} views
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Deadline: {new Date(job.application_deadline).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;