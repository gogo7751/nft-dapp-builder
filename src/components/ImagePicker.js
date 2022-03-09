import React, { useState, useContext, useEffect, useRef } from 'react'
import { FileUploader } from "react-drag-drop-files"
import { UserContext } from '../UserContex'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ProjectDataService from '../services/ProjectDataService'
import StorageService from '../services/StorageService'
import AlertMessage from './Alert'

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import EditIcon from '@mui/icons-material/Edit'

const useStyles = makeStyles((theme) => ({
    input: {
        display: 'none',
    },
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '7px',
    },
    label: {
        fontSize: '17px',
        marginTop: '4px'
    },
    subLabel: {
        fontSize: '12px',
        marginTop: '4px',
        fontWeight: 'bold',
    },
    editLabel: {
        fontSize: '8px',
        marginLeft: '4px',
    },
}))

export default function ImagePicker({ label, maximumSize, field, subField, height, gutterTop, gutterBottom, fromImage, selectFileEvent }) {
    const fileTypes = ["JPG", "PNG", "GIF"]

    const classes = useStyles()    
    const { project, setProject, setLoading } = useContext(UserContext)
    const projectData = useRef(null)
    const [imageFile, setImageFile] = useState(null)
    const [image, setImage] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [alert, setAlert] = useState("")

    const sxGutterTop = gutterTop ? {marginTop: 4} : {}
    const sxGutterBottom = gutterBottom ? {marginBottom: 4} : {}

    useEffect(()=> {
        if(field && subField) {
            try {
                const data = project[field]
                setImage(data[subField])
            }
            catch (error) {
                setImage(null)
            }
        }
        else if(fromImage) {
            setImage(fromImage)
        }
        setImageFile(null)
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project, field, subField])

    const sxContainer = {
        border: 1, 
        width: "100%", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: {height}, 
        borderRadius: "8px", 
        cursor: "pointer",         
        borderColor: 'grey.400'
    }

    const sxEdit = {
        position: 'relative', 
        top: '-96%', 
        left: '5%',
        opacity: "0.85",
        border: 1,         
        display: "inline-flex",
        padding: 0.4,
        borderRadius: "4px",
        borderColor: 'grey.400',
        bgcolor: 'info.main'
    }

    const emptyImage = () => {
        return (
            <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                sx={{opacity: "0.3"}}
            >
                <AddPhotoAlternateIcon style={{ fontSize: 50 }}/>
                <div className={classes.label}> {dragging ? "Drop Here" : label} </div>
                <div className={classes.subLabel}> (maximum size: {maximumSize}MB) </div>
            </Box>
        )
    }

    const previewImage = () => {
        return (
            <Box sx={{ height: "100%", width:"100%"}}>
                <img 
                    alt=""
                    className={classes.img}
                    src={ imageFile ? URL.createObjectURL(imageFile) : image }
                />

                <Box sx={sxEdit}>                
                    <EditIcon style={{ fontSize: 15 }}/>
                    <div className={classes.editLabel}>{label}</div>
                </Box>
            </Box>
        )
    }

    const handleSelectFile = (file) => {
        setImageFile(file)

        if(field && subField) { // has field & subField -> auto save image url to firestore
            setLoading(true)

            // upload to storage
            const imageName = field + '-' + subField + '-' + project.project_id
            StorageService.uploadProcess(file, imageName, (imageURL) => {
                
                setImage(imageURL)

                // update project data
                try {
                    const data = project[field]
                    const newProjectData = { ...project, [field]: { ...data, [subField]: imageURL }}
                    setProject(newProjectData)
                    projectData.current = newProjectData
                }
                catch(error) {
                    const newProjectData = { ...project, [field]: { [subField]: imageURL }}
                    setProject(newProjectData)
                    projectData.current = newProjectData
                }

                ProjectDataService.updateProjectData(projectData.current)
                setLoading(false)
            })  
        }
        else if(selectFileEvent) {
            selectFileEvent(file)
        }
    }

    const handleDraggingStateChange = (dragging) => {
        setDragging(dragging)
    }

    const handleTypeError = (err) => {
        setAlert("Please select image file (JPG, PNG, GIF)")
    }

    const handleSizeError = (file) => {
        setAlert("Maximum image file size: " + maximumSize + " MB")
    }

    return (
       <>
            <Box sx={sxGutterTop}></Box>
            
            <FileUploader 
                name="file"
                label=" "
                hoverTitle=" "
                handleChange={handleSelectFile}
                onTypeError={handleTypeError}
                onSizeError={handleSizeError}
                onDraggingStateChange={handleDraggingStateChange}                
                maxSize={maximumSize}
                types={fileTypes}>
                <Box 
                    sx={sxContainer} 
                    bgcolor={dragging ? "primary.main" : "info.main"}
                >
                    { (imageFile || image) ? previewImage() : emptyImage() }
                </Box>
            </FileUploader>

            <Box sx={sxGutterBottom}></Box>

            {/* Alert */}
            <AlertMessage alertState={{alert, setAlert}}/>
       </>
    )
}