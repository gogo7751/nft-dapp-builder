import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField  } from '@mui/material'
import ProjectDataService from '../services/ProjectDataService'
import AlertMessage from './Alert'

import { useContext } from 'react'
import { UserContext } from '../UserContex'
import UserDataService from '../services/UserDataService'


export default function ProjectDialog({ openState }) {
    const history = useHistory()
    const { setUser, setProject, setLoading } = useContext(UserContext)

    const [projectName, setProjectName] = useState("")
    const [alert, setAlert] = useState("")
    const { openProjectDialog, setOpenProjectDialog } = openState

    const handleClose = () => {
        setOpenProjectDialog(false)
    }

    const handleCreate = async () => {
        if(projectName === "") {
            setAlert("Please enter project name")
        }
        else {
            setOpenProjectDialog(false)
            
            setLoading(true)
            const projectId = await ProjectDataService.createProject(projectName)

            const userData = await UserDataService.getUserData()
            setUser(userData)

            const projectData = await ProjectDataService.getProjectData(projectId)
            setProject(projectData)

            setLoading(false)
            
            setProjectName("")

            history.push('/website')
        }
    }

    return (
        <Dialog 
            open={openProjectDialog} 
            onClose={handleClose} 
            maxWidth={'sm'} 
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
                    autoComplete = "off" 
                    variant="standard"
                    onChange={(e) => { setProjectName(e.target.value) }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
            </DialogActions>

            {/* Alert */}
            <AlertMessage alertState={{alert, setAlert}}/>

        </Dialog>      
    )
}
