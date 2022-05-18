import React, { useState, useContext, useEffect } from "react";
import { FormControlLabel, Switch } from "@mui/material";
import { UserContext } from "../UserContext";
import ProjectDataService from "../services/ProjectDataService";

export default function SwitchInput({ sx, label, field, subField }) {
  const { project, setProject } = useContext(UserContext);
  const [value, setValue] = useState(false);

  useEffect(() => {
    try {
      const data = project[field];
      setValue(data[subField]);
    } catch (error) {
      setValue(false);
    }
  }, [project, field, subField]);

  const handleChange = (event) => {
    const checked = event.target.checked;
    setValue(checked);

    // update project data
    try {
      const data = project[field];
      const newProjectData = {
        ...project,
        [field]: { ...data, [subField]: checked },
        updatedDate: Math.round(new Date().getTime() / 1000),
      };
      setProject(newProjectData);
      ProjectDataService.updateProjectData(newProjectData);
    } catch (error) {
      const newProjectData = {
        ...project,
        [field]: { [subField]: checked },
        updatedDate: Math.round(new Date().getTime() / 1000),
      };
      setProject(newProjectData);
    }
  };

  return (
    <FormControlLabel
      sx={sx ? sx : { marginTop: -5, paddingRight: 2 }}
      value="start"
      control={
        <Switch color="primary" checked={value} onChange={handleChange} />
      }
      label={label}
      labelPlacement="start"
    />
  );
}
