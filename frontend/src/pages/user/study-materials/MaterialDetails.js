import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserLayout from "../../../components/layout/UserLayout";
import axios from "../../../utils/axios";
import useAuth from "../../../hooks/useAuth";

const MaterialDetails = () => {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        setError(null);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const response = await axios.get(
          `/api/users/study-materials/${id}/`,
          config
        );
        console.log("Material data:", response.data);
        setMaterial(response.data);
      } catch (error) {
        console.error("Error fetching material:", error);
        setError(
          error.response?.data?.error || "Failed to fetch material details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id, user.token]);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  const renderFileContent = (file) => {
    if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return (
        <img
          src={file}
          alt="Study Material"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      );
    } else if (file.match(/\.(mp4|webm|ogg)$/i)) {
      return (
        <video controls style={{ width: "100%", maxHeight: "400px" }}>
          <source src={file} type={`video/${file.split(".").pop()}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <Button
          variant="contained"
          href={file}
          target="_blank"
          rel="noopener noreferrer"
        >
          View PDF
        </Button>
      );
    }
  };

  return (
    <UserLayout>
      <Box sx={{ p: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
          aria-label="go back"
        >
          <ArrowBackIcon />
        </IconButton>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {material && (
          <>
            <Typography variant="h4" gutterBottom>
              {material.title}
            </Typography>
            <Card>
              <CardContent>
                {material.content.text && (
                  <Typography variant="body1" paragraph>
                    {material.content.text}
                  </Typography>
                )}
                {material.content.youtube && (
                  <Box sx={{ mt: 2 }}>
                    <iframe
                      width="100%"
                      height="315"
                      src={getYoutubeEmbedUrl(material.content.youtube)}
                      frameBorder="0"
                      title={`${material.title} video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                )}
                {material.content.file && (
                  <Box sx={{ mt: 2 }}>
                    {renderFileContent(material.content.file)}
                  </Box>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </UserLayout>
  );
};

export default MaterialDetails;
