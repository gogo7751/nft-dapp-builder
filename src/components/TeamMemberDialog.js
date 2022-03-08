import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { makeStyles } from '@mui/styles'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography, Avatar  } from '@mui/material'
import AlertMessage from './Alert'
import StorageService from '../services/StorageService'
import PhotoIcon from '@mui/icons-material/Photo'

const useStyles = makeStyles((theme) => ({
    input: {
        display: 'none',
    },
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '7px',
    }
}))

export default function TeamMemberDialog({ dialogTitle, actionLabel, item, openItemDialog, setOpenItemDialog, handleAction, setLoading }) {
    const classes = useStyles()    
    const [imageFile, setImageFile] = useState(null)
    const [image, setImage] = useState(null)
    const [primary, setPrimary] = useState(null)
    const [secondary, setSecondary] = useState(null)
    const [linkedin, setLinkedin] = useState(null)
    const [twitter, setTwitter] = useState(null)
    const [alert, setAlert] = useState("")

    useEffect(()=> {
        setPrimary(item?.primary)
        setSecondary(item?.secondary)
        setLinkedin(item?.linkedin)
        setTwitter(item?.twitter)
        setImage(item?.image)
    }, [item])

    const handleClose = () => {
        setPrimary(item?.primary)
        setSecondary(item?.secondary)
        setLinkedin(item?.linkedin)
        setTwitter(item?.twitter)
        setImage(item?.image)
        setImageFile(null)
        setOpenItemDialog(false)
    }

    const handleAdd = async () => {
        if(primary === "" || primary === undefined || primary === null) {
            setAlert("Please enter name")
        }
        else if((image === null || image === undefined) && (imageFile === null)) {
            setAlert("Please select image")
        }
        else {
            const itemId = item?.id === undefined ? uuidv4() : item?.id
            if(imageFile) {
                setLoading(true)
                StorageService.uploadProcess(imageFile, itemId, (imageURL) => {
                    setLoading(false)
                    handleAction({
                        id: itemId,
                        primary: primary,
                        secondary: secondary === undefined ? "" : secondary,
                        linkedin: linkedin === undefined ? "" : linkedin,
                        twitter: twitter === undefined ? "" : twitter,    
                        image: imageURL
                    })
                })    
            }
            else {
                handleAction({
                    id: itemId,
                    primary: primary,
                    secondary: secondary === undefined ? "" : secondary,
                    linkedin: linkedin === undefined ? "" : linkedin,
                    twitter: twitter === undefined ? "" : twitter,    
                    image: image
                })
            }
            handleClose()    
        }
    }

    const emptyImage = () => {
        return (
            <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                sx={{opacity: "0.6"}}
            >
                <Avatar sx={{marginBottom:1}}>
                    <PhotoIcon />
                </Avatar>
                <Typography variant='body2'>Select Image</Typography>
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

                <Avatar sx={{ position: 'absolute', top: '45%', left: '14.5%', }}>
                    <PhotoIcon />
                </Avatar>
            </Box>
        )
    }

    return (
        <Dialog 
            open={openItemDialog} 
            onClose={handleClose} 
            maxWidth={'sm'} 
            fullWidth={true}
        >
            <DialogTitle>{dialogTitle}</DialogTitle>

            <DialogContent>
                <Grid container spacing={3}>

                    {/* Member Photo */}
                    <Grid item xs={4} sm={4}>
                        <label htmlFor="contained-button-file">
                            <Box 
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                borderRadius={2} 
                                sx={{border: 1, height: "98%", cursor: "pointer", borderColor: 'grey.400'}}                            
                            >
                            { (imageFile || image) ? previewImage() : emptyImage() }                            
                            </Box>
                        </label>

                        <input
                            accept="image/*"
                            className={classes.input}
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={(e) => { setImageFile(e.target.files[0]) }}
                        />
                    </Grid>

                    {/* Member Name */}
                    <Grid item xs={8} sm={8}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            fullWidth
                            autoComplete = "off" 
                            variant="outlined"                    
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => { setPrimary(e.target.value) }}
                            size="small"
                            value={primary ? primary : ""}
                        />

                        <Box sx={{height:10}}></Box>

                        {/* Member Title */}
                        <TextField
                            margin="dense"
                            id="title"
                            label="Title"
                            fullWidth
                            autoComplete = "off" 
                            variant="outlined"                    
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => { setSecondary(e.target.value) }}
                            size="small"
                            value={secondary ? secondary : ""}
                        />

                        <Box sx={{height:10}}></Box>

                        {/* Member Linkedin */}
                        <TextField
                            margin="dense"
                            id="title"
                            label="Linkedin"
                            fullWidth
                            autoComplete = "off" 
                            variant="outlined"                    
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => { setLinkedin(e.target.value) }}
                            size="small"
                            value={linkedin ? linkedin : ""}
                        />

                        <Box sx={{height:10}}></Box>

                        {/* Member Twitter */}
                        <TextField
                            margin="dense"
                            id="title"
                            label="Twitter"
                            fullWidth
                            autoComplete = "off" 
                            variant="outlined"                    
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => { setTwitter(e.target.value) }}
                            size="small"
                            value={twitter ? twitter : ""}
                        />

                    </Grid>
                </Grid>

            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAdd}>{actionLabel}</Button>
            </DialogActions>

            {/* Alert */}
            <AlertMessage alertState={{alert, setAlert}}/>
        </Dialog>      
    )
}
