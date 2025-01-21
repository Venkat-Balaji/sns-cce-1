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
import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PublicIcon from "@mui/icons-material/Public";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const JobMaterials = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "MNC",
      icon: BusinessIcon,
      description: "Study materials for Multinational Companies",
      path: "/user/job-materials/mnc",
    },
    {
      title: "State Government",
      icon: AccountBalanceIcon,
      description: "Study materials for State Government jobs",
      path: "/user/job-materials/state",
    },
    {
      title: "Central Government",
      icon: PublicIcon,
      description: "Study materials for Central Government jobs",
      path: "/user/job-materials/central",
    },
    {
      title: "Others",
      icon: MoreHorizIcon,
      description: "Other job-related study materials",
      path: "/user/job-materials/others",
    },
  ];

  return (
    <UserLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Job Materials
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {categories.map((category) => (
            <Grid item xs={12} md={6} key={category.title}>
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
                  <category.icon
                    sx={{ fontSize: 60, mb: 2, color: "primary.main" }}
                  />
                  <Typography variant="h5" gutterBottom>
                    {category.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {category.description}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(category.path)}
                  >
                    View Materials
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </UserLayout>
  );
};

export default JobMaterials;
