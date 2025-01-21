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
} from "@mui/material";
import UserLayout from "../../../components/layout/UserLayout";
import axios from "../../../utils/axios";
import useAuth from "../../../hooks/useAuth";
import YouTubeIcon from "@mui/icons-material/YouTube";
import DescriptionIcon from "@mui/icons-material/Description";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

const ExamMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
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
  };

  const renderContent = (material) => {
    return (
      <Box sx={{ mt: 2 }}>
        {material.content.text && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              <TextSnippetIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Text Content
            </Typography>
            <Typography variant="body2">{material.content.text}</Typography>
          </Box>
        )}
        {material.content.youtube && (
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<YouTubeIcon />}
              variant="outlined"
              color="error"
              href={material.content.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch Video
            </Button>
          </Box>
        )}
        {material.content.file && (
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<DescriptionIcon />}
              variant="outlined"
              href={material.content.file}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Document
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <UserLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Exam Study Materials
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="competitive">Competitive Exams</MenuItem>
              <MenuItem value="entrance">Entrance Exams</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {materials.map((material) => (
            <Grid item xs={12} md={6} key={material._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {material.title}
                  </Typography>
                  <Chip
                    label={material.category}
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  {renderContent(material)}
                </CardContent>
              </Card>
            </Grid>
          ))}
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
