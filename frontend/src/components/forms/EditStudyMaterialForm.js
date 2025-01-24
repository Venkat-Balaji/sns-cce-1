import React, { useState, useEffect } from "react";
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
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "../../utils/axios";
import useAuth from "../../hooks/useAuth";

const EditStudyMaterialForm = ({ material, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    category: "",
    conductingBody: "",
    examType: "",
    eligibility: {
      education: "",
      ageLimit: "",
      otherRequirements: "",
    },
    pattern: {
      questionCount: "",
      questionTypes: "",
      markingScheme: "",
    },
    dates: [
      { event: "Application Start", date: null },
      { event: "Application End", date: null },
      { event: "Exam Date", date: null },
      { event: "Result Date", date: null },
    ],
    content: {
      text: "",
      youtube: "",
      file: null,
    },
    resources: {
      mockTests: "",
      studyMaterials: "",
      previousYearPapers: "",
    },
    faqs: [
      { question: "", answer: "" }
    ],
    syllabus: {
      subjects: [
        { name: "", topics: "" }
      ]
    },
  });

  useEffect(() => {
    if (material) {
      setFormData({
        ...material,
        content: {
          ...material.content,
          file: null, // Reset file input
        },
      });
    }
  }, [material]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFAQChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const removeFAQ = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleSyllabusChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      syllabus: {
        ...prev.syllabus,
        subjects: prev.syllabus.subjects.map((subject, i) => 
          i === index ? { ...subject, [field]: value } : subject
        ),
      },
    }));
  };

  const addSubject = () => {
    setFormData((prev) => ({
      ...prev,
      syllabus: {
        ...prev.syllabus,
        subjects: [...prev.syllabus.subjects, { name: "", topics: "" }],
      },
    }));
  };

  const removeSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      syllabus: {
        ...prev.syllabus,
        subjects: prev.syllabus.subjects.filter((_, i) => i !== index),
      },
    }));
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
      
      // Convert complex objects to JSON strings
      const dataToSend = {
        ...formData,
        content: {
          text: formData.content.text,
          youtube: formData.content.youtube,
        },
      };
      
      formDataToSend.append("data", JSON.stringify(dataToSend));
      
      if (formData.content.file) {
        formDataToSend.append("file", formData.content.file);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.put(`/api/users/study-materials/${material._id}/`, formDataToSend, config);
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Error updating study material:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Edit Study Material
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Basic Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
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
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Material Type</InputLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        label="Material Type"
                        required
                      >
                        <MenuItem value="exam">Exam</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        label="Category"
                        required
                      >
                        <MenuItem value="competitive">Competitive Exams</MenuItem>
                        <MenuItem value="entrance">Entrance Exams</MenuItem>
                        <MenuItem value="others">Others</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Conducting Body"
                      name="conductingBody"
                      value={formData.conductingBody}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Exam Type"
                      name="examType"
                      value={formData.examType}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Eligibility Criteria */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Eligibility Criteria</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Educational Qualifications"
                      name="eligibility.education"
                      value={formData.eligibility.education}
                      onChange={handleChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Age Limit"
                      name="eligibility.ageLimit"
                      value={formData.eligibility.ageLimit}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Other Requirements"
                      name="eligibility.otherRequirements"
                      value={formData.eligibility.otherRequirements}
                      onChange={handleChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Exam Pattern */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Exam Pattern</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Number of Questions"
                      name="pattern.questionCount"
                      value={formData.pattern.questionCount}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Types of Questions"
                      name="pattern.questionTypes"
                      value={formData.pattern.questionTypes}
                      onChange={handleChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Marking Scheme"
                      name="pattern.markingScheme"
                      value={formData.pattern.markingScheme}
                      onChange={handleChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Resources */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Resources</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mock Tests URL"
                      name="resources.mockTests"
                      value={formData.resources.mockTests}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Study Materials URL"
                      name="resources.studyMaterials"
                      value={formData.resources.studyMaterials}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Previous Year Papers URL"
                      name="resources.previousYearPapers"
                      value={formData.resources.previousYearPapers}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* FAQs */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">FAQs</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {formData.faqs.map((faq, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Question"
                          value={faq.question}
                          onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                        />
                        <IconButton
                          color="error"
                          onClick={() => removeFAQ(index)}
                          disabled={formData.faqs.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <TextField
                        fullWidth
                        label="Answer"
                        value={faq.answer}
                        onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                        multiline
                        rows={2}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addFAQ}
                      variant="outlined"
                      fullWidth
                    >
                      Add FAQ
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Syllabus */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Syllabus</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {formData.syllabus.subjects.map((subject, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Subject Name"
                          value={subject.name}
                          onChange={(e) => handleSyllabusChange(index, 'name', e.target.value)}
                        />
                        <IconButton
                          color="error"
                          onClick={() => removeSubject(index)}
                          disabled={formData.syllabus.subjects.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <TextField
                        fullWidth
                        label="Important Topics"
                        value={subject.topics}
                        onChange={(e) => handleSyllabusChange(index, 'topics', e.target.value)}
                        multiline
                        rows={2}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addSubject}
                      variant="outlined"
                      fullWidth
                    >
                      Add Subject
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Content */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Additional Content</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Update Material
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EditStudyMaterialForm; 