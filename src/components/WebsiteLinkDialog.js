import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material'
import ProjectDataService from '../services/ProjectDataService'
import AlertMessage from './Alert'

import { useContext } from 'react'
import { UserContext } from '../UserContext'

const checkLinkName = (name) => {
  return /^[a-z0-9]*$/.test(name)
}

export default function WebsiteLinkDialog({ openState }) {  
  const { project, setProject, setLoading } = useContext(UserContext)
  const [link, setLink] = useState(null)
  const [alert, setAlert] = useState('')
  const { openLinkDialog, setOpenLinkDialog } = openState
  const orgLink = useRef(null)

  useEffect(() => {
    if(openLinkDialog) {
      try {
        const data = project['website']
        orgLink.current = data['link']
        setLink(orgLink.current)
      } catch (error) {
        setLink(false);
      }
    }
  }, [openLinkDialog]);

  const handleClose = () => {
    setOpenLinkDialog(false)
    setLink(null)
  };

  const handleCreate = async () => {
    if (link === null || link === '' || link === undefined) {
      setAlert('Please enter website link')
    }
    else if(checkLinkName(link) === false) {
      setAlert('Invalid website link (only accept lower case letter/ numbers)')
    } else {      
      setOpenLinkDialog(false)

      if(orgLink.current === link) { return }

      setLoading(true)
            
      try {
        const data = project['website'];
        const newProjectData = {
          ...project,
          ['website']: { ...data, ['link']: link },
        };
        setProject(newProjectData);
        await ProjectDataService.updateProjectData(newProjectData);
      } catch (error) {
        const newProjectData = { ...project, ['website']: { ['link']: link } };
        setProject(newProjectData);
      }
      
      setLoading(false)      
      setLink(null)      
    }
  };

  return (
    <Dialog
      open={openLinkDialog}
      onClose={handleClose}
      maxWidth={'xs'}
      fullWidth={true}
    >
      <DialogTitle>Website Link</DialogTitle>
      <DialogContent>
        <TextField
          label="Enter website link"
          autoFocus
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          autoComplete="off"
          inputProps = {{ spellCheck: false }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography>nftpod.app/</Typography>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          value={link ? link : ''}
          onChange={(e) => {
            setLink(e.target.value);
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreate}>Ok</Button>
      </DialogActions>

      {/* Alert */}
      <AlertMessage alertState={{ alert, setAlert }} />
    </Dialog>
  );
}
