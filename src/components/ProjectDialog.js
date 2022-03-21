import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import ProjectDataService from '../services/ProjectDataService';
import AlertMessage from './Alert';

import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { NetworkSelector } from '../components/Selector';
import UserDataService from '../services/UserDataService';

export default function ProjectDialog({ openState }) {
  const history = useNavigate();
  const { setUser, setProject, setLoading } = useContext(UserContext);

  const [projectName, setProjectName] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [alert, setAlert] = useState('');
  const { openProjectDialog, setOpenProjectDialog } = openState;

  const handleClose = () => {
    setOpenProjectDialog(false);
    setProjectName(null);
    setNetworkId(null);
  };

  const handleCreate = async () => {
    if (projectName === null || projectName === '') {
      setAlert('Please enter project name');
    } else if (networkId === null) {
      setAlert('Please select network');
    } else {
      setOpenProjectDialog(false);

      setLoading(true);
      const projectId = await ProjectDataService.createProject(
        projectName,
        networkId
      );

      const userData = await UserDataService.getUserData();
      setUser(userData);

      const projectData = await ProjectDataService.getProjectData(projectId);
      setProject(projectData);

      setLoading(false);

      setProjectName(null);
      setNetworkId(null);

      history('/website');
    }
  };

  return (
    <Dialog
      open={openProjectDialog}
      onClose={handleClose}
      maxWidth={'xs'}
      fullWidth={true}
    >
      <DialogTitle>Create new project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Project name"
          fullWidth
          autoComplete="off"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            setProjectName(e.target.value);
          }}
        />

        <NetworkSelector
          value={networkId}
          setValue={setNetworkId}
          field={null}
          subField={null}
          gutterTop
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>

      {/* Alert */}
      <AlertMessage alertState={{ alert, setAlert }} />
    </Dialog>
  );
}
