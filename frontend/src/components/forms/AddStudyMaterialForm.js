import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import axios from "../../utils/axios";
import useAuth from "../../hooks/useAuth";

const AddStudyMaterialForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    category: "",
    content: {
      text: "",
      youtube: "",
      file: null,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Change event:", name, value);
    if (name.startsWith("content.")) {
      const contentField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          [contentField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        file: e.target.files[0],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("category", formData.category);
      formDataToSend.append(
        "content",
        JSON.stringify({
          text: formData.content.text,
          youtube: formData.content.youtube,
        })
      );
      if (formData.content.file) {
        formDataToSend.append("file", formData.content.file);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post(
        "/api/users/study-materials/add/",
        formDataToSend,
        config
      );
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Error adding study material:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add Study Material
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Material Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Material Type"
                required
              >
                <MenuItem value="job">Job</MenuItem>
                <MenuItem value="exam">Exam</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
                required
              >
                {formData.type === "job" && [
                  <MenuItem key="mnc" value="mnc">
                    MNC
                  </MenuItem>,
                  <MenuItem key="state" value="state">
                    State Government
                  </MenuItem>,
                  <MenuItem key="central" value="central">
                    Central Government
                  </MenuItem>,
                  <MenuItem key="others" value="others">
                    Others
                  </MenuItem>,
                ]}
                {formData.type === "exam" && [
                  <MenuItem key="competitive" value="competitive">
                    Competitive Exams
                  </MenuItem>,
                  <MenuItem key="entrance" value="entrance">
                    Entrance Exams
                  </MenuItem>,
                  <MenuItem key="others" value="others">
                    Others
                  </MenuItem>,
                ]}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Content (Add one or more)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Text Content"
              name="content.text"
              value={formData.content.text}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="YouTube Link"
              name="content.youtube"
              value={formData.content.youtube}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </Grid>

          <Grid item xs={12}>
            <input
              accept="image/*,video/*,.pdf"
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button variant="outlined" component="span">
                Upload File (PDF/Image/Video)
              </Button>
            </label>
            {formData.content.file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {formData.content.file.name}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Add Material
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddStudyMaterialForm;
