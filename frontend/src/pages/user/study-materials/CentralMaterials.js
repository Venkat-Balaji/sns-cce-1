import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../../components/layout/UserLayout";
import axios from "../../../utils/axios";
import useAuth from "../../../hooks/useAuth";

const CentralMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const response = await axios.get(
          "/api/users/study-materials/?category=central",
          config
        );
        setMaterials(response.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMaterials();
  }, [user.token]);

  return (
    <UserLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Central Government Study Materials
        </Typography>
        <Grid container spacing={3}>
          {materials.map((material) => (
            <Grid item xs={12} md={6} key={material._id}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate(`/study-materials/${material._id}`)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {material.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </UserLayout>
  );
};

export default CentralMaterials;
