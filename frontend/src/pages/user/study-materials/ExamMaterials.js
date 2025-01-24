import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import UserLayout from "../../../components/layout/UserLayout";
import axios from "../../../utils/axios";
import useAuth from "../../../hooks/useAuth";
import YouTubeIcon from "@mui/icons-material/YouTube";
import DescriptionIcon from "@mui/icons-material/Description";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuizIcon from "@mui/icons-material/Quiz";
import HelpIcon from "@mui/icons-material/Help";
import ForumIcon from "@mui/icons-material/Forum";
import ShareIcon from "@mui/icons-material/Share";
import FeedbackIcon from "@mui/icons-material/Feedback";

const ExamMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [selectedExam, setSelectedExam] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchMaterials();
  }, [category]);

  const fetchMaterials = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          type: "exam",
          category: category,
        },
      };
      const response = await axios.get("/api/users/study-materials/", config);
      setMaterials(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exam materials:", error);
      setLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setSelectedExam(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderExamOverview = (exam) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Exam Overview</Typography>
        <List>
          <ListItem>
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Exam Name" secondary={exam.title} />
          </ListItem>
          <ListItem>
            <ListItemIcon><SchoolIcon /></ListItemIcon>
            <ListItemText primary="Conducting Body" secondary={exam.conductingBody} />
          </ListItem>
          <ListItem>
            <ListItemIcon><QuizIcon /></ListItemIcon>
            <ListItemText primary="Exam Type" secondary={exam.examType} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  const renderEligibilityCriteria = (exam) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Eligibility Criteria</Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="Educational Qualifications" 
              secondary={exam.eligibility?.education || "Not specified"} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Age Limit" 
              secondary={exam.eligibility?.ageLimit || "Not specified"} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Other Requirements" 
              secondary={exam.eligibility?.otherRequirements || "Not specified"} 
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  const renderExamPattern = (exam) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Exam Pattern</Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="Number of Questions" 
              secondary={exam.pattern?.questionCount || "Not specified"} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Types of Questions" 
              secondary={exam.pattern?.questionTypes || "Not specified"} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Marking Scheme" 
              secondary={exam.pattern?.markingScheme || "Not specified"} 
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  const renderImportantDates = (exam) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Important Dates</Typography>
        <List>
          {exam.dates?.map((date, index) => (
            <ListItem key={index}>
              <ListItemIcon><EventIcon /></ListItemIcon>
              <ListItemText primary={date.event} secondary={date.date} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderPreparationResources = (exam) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Preparation Resources</Typography>
        <Grid container spacing={2}>
          {exam.resources?.mockTests && (
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<QuizIcon />}
                href={exam.resources.mockTests}
                target="_blank"
              >
                Mock Tests
              </Button>
            </Grid>
          )}
          {exam.resources?.studyMaterials && (
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DescriptionIcon />}
                href={exam.resources.studyMaterials}
                target="_blank"
              >
                Study Materials
              </Button>
            </Grid>
          )}
          {exam.resources?.previousYearPapers && (
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AssignmentIcon />}
                href={exam.resources.previousYearPapers}
                target="_blank"
              >
                Previous Papers
              </Button>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderFAQs = (exam) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>FAQs</Typography>
        {exam.faqs?.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );

  const renderCommunityFeatures = (exam) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Community & Support</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ForumIcon />}
              onClick={() => {/* Handle discussion forum */}}
            >
              Discussion Forum
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<HelpIcon />}
              onClick={() => {/* Handle doubt clearing */}}
            >
              Ask Doubts
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FeedbackIcon />}
              onClick={() => {/* Handle feedback */}}
            >
              Give Feedback
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <UserLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <CircularProgress />
        </Box>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" gutterBottom>
            Exam Study Materials
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={handleCategoryChange} label="Category">
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="competitive">Competitive Exams</MenuItem>
              <MenuItem value="entrance">Entrance Exams</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {!selectedExam ? (
            materials.map((material) => (
              <Grid item xs={12} md={6} key={material._id}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => setSelectedExam(material)}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {material.title}
                    </Typography>
                    <Chip label={material.category} color="primary" size="small" sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {material.content?.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Button variant="outlined" onClick={() => setSelectedExam(null)}>
                  Back to All Exams
                </Button>
              </Box>
              
              <Paper sx={{ mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                  <Tab label="Overview" />
                  <Tab label="Eligibility" />
                  <Tab label="Pattern" />
                  <Tab label="Important Dates" />
                  <Tab label="Resources" />
                  <Tab label="FAQs" />
                  <Tab label="Community" />
                </Tabs>
              </Paper>

              <Box hidden={tabValue !== 0}>{renderExamOverview(selectedExam)}</Box>
              <Box hidden={tabValue !== 1}>{renderEligibilityCriteria(selectedExam)}</Box>
              <Box hidden={tabValue !== 2}>{renderExamPattern(selectedExam)}</Box>
              <Box hidden={tabValue !== 3}>{renderImportantDates(selectedExam)}</Box>
              <Box hidden={tabValue !== 4}>{renderPreparationResources(selectedExam)}</Box>
              <Box hidden={tabValue !== 5}>{renderFAQs(selectedExam)}</Box>
              <Box hidden={tabValue !== 6}>{renderCommunityFeatures(selectedExam)}</Box>
            </Grid>
          )}
          {materials.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="center">
                No exam materials found for this category.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </UserLayout>
  );
};

export default ExamMaterials;
