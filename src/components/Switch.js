import React, { useState, useContext, useEffect, useRef } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { UserContext } from '../UserContext';
import ProjectDataService from '../services/ProjectDataService';

export default function SwitchInput({ label, field, subField }) {
  const { project, setProject } = useContext(UserContext);
  const [value, setValue] = useState(false);
  const timerRef = useRef(null);
  const projectData = useRef(null);

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
      };
      setProject(newProjectData);
      projectData.current = newProjectData;
    } catch (error) {
      const newProjectData = { ...project, [field]: { [subField]: checked } };
      setProject(newProjectData);
      projectData.current = newProjectData;
    }

    // auto save
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      console.log('switch auto save...');
      ProjectDataService.updateProjectData(projectData.current);
    }, 1000);
  };

  return (
    <FormControlLabel
      sx={{ marginTop: -5, paddingRight: 2 }}
      value="start"
      control={
        <Switch color="primary" checked={value} onChange={handleChange} />
      }
      label={label}
      labelPlacement="start"
    />
  );
}
