import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../../components/layout/UserLayout";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";

const StudyMaterialsSelection = () => {
  const navigate = useNavigate();

  return (
    <UserLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Study Materials
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 4,
                }}
              >
                <WorkIcon sx={{ fontSize: 60, mb: 2, color: "primary.main" }} />
                <Typography variant="h5" gutterBottom>
                  Job Materials
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Access study materials for MNC, State, Central Government, and
                  other job preparations
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/user/job-materials")}
                >
                  View Job Materials
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 4,
                }}
              >
                <SchoolIcon
                  sx={{ fontSize: 60, mb: 2, color: "primary.main" }}
                />
                <Typography variant="h5" gutterBottom>
                  Exam Materials
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Access study materials for various competitive exams and
                  preparations
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/user/exam-materials")}
                >
                  View Exam Materials
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </UserLayout>
  );
};

export default StudyMaterialsSelection;
