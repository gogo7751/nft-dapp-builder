import React, { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../UserContext";
import { TextField } from "@mui/material";
import ProjectDataService from "../services/ProjectDataService";

export default function TextInput({
  label,
  placeholder,
  field,
  subField,
  gutterTop,
  gutterBottom,
  multiline,
  disabled,
}) {
  const { project, setProject } = useContext(UserContext);
  const [value, setValue] = useState(null);
  const timerRef = useRef(null);
  const projectData = useRef(null);
  const sx = {};
  if (gutterTop) sx["marginTop"] = 4;
  if (gutterBottom) sx["marginBottom"] = 4;

  useEffect(() => {
    try {
      const data = project[field];
      setValue(data[subField]);
    } catch (error) {
      setValue(null);
    }
  }, [project, field, subField]);

  const handleTextChange = (event) => {
    const text = event.target.value;
    setValue(text);

    // update project data
    try {
      const data = project[field];
      const newProjectData = {
        ...project,
        [field]: { ...data, [subField]: text },
        updatedDate: Math.round(new Date().getTime() / 1000),
      };
      setProject(newProjectData);
      projectData.current = newProjectData;
    } catch (error) {
      const newProjectData = {
        ...project,
        [field]: { [subField]: text },
        updatedDate: Math.round(new Date().getTime() / 1000),
      };
      setProject(newProjectData);
      projectData.current = newProjectData;
    }

    // auto save
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      console.log("auto save...");
      ProjectDataService.updateProjectData(projectData.current);
    }, 1000);
  };

  const singleLineTextField = () => {
    return (
      <TextField
        sx={sx}
        label={label}
        fullWidth
        size="normal" //"small"
        placeholder={placeholder}
        color="secondary"
        autoComplete="off"
        value={value ? value : ""}
        onChange={handleTextChange}
        InputLabelProps={{ shrink: true }}
        disabled={disabled}
      />
    );
  };

  const multipleLinesTextField = () => {
    return (
      <TextField
        sx={sx}
        label={label}
        fullWidth
        size="normal" //"small"
        placeholder={placeholder}
        color="secondary"
        autoComplete="off"
        value={value ? value : ""}
        onChange={handleTextChange}
        InputLabelProps={{ shrink: true }}
        rows={4}
        multiline
      />
    );
  };

  return <>{multiline ? multipleLinesTextField() : singleLineTextField()}</>;
}
