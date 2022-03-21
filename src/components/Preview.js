import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, AppBar, Toolbar, Stack, Box, Grid, IconButton, Typography } from '@mui/material'

import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import TvIcon from '@mui/icons-material/Tv'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

import { makeStyles } from '@mui/styles'
//import { withGlobalState } from 'react-globally'

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar
}))

//const Preview = ({ setGlobalState }) => {        
const Preview = ({ children }) => {        
    const classes = useStyles()
    const navigate = useNavigate()
    const [phoneMode, setPhoneMode] = useState(false);


    const handleExit = () => {
        // setGlobalState(prevGlobalState => ({
        //     enableLayout: true
        // }))
        navigate('/website')
    }

    const sxSelected = {
        backgroundColor:'#ffffff40'
    }

    const phoneScreen = () => {    
        return (
            <Grid container spacing={2}>
                <Grid item sm={4.5}>
                    <Box        
                        bgcolor="#2D2D2D"        
                        sx={{height:'100vh'}}
                    />
                </Grid>

                <Grid item sm={3}>
                    { children }        
                </Grid>

                <Grid item sm={4.5}>
                    <Box        
                        bgcolor="#2D2D2D"        
                        sx={{height:'100vh'}}
                    />                    
                </Grid>                
            </Grid>
        )
    }

    return (
        <>
            <AppBar position="fixed">
                <Toolbar sx={{justifyContent: "space-between"}}>
                    <Stack
                        direction="row" 
                        alignItems="center" 
                        justifyContent="center"  
                        //spacing={1}                  
                    >
                    <Typography variant='h6'>
                        Preview
                    </Typography>

                    <Box sx={{width: 30}}></Box>
                    
                    <IconButton 
                        onClick={() => setPhoneMode(false) }
                        color="inherit"
                        sx={ phoneMode ? null : sxSelected }
                    >
                        <TvIcon fontSize='small'/>
                    </IconButton>

                    <IconButton 
                        onClick={() => setPhoneMode(true) }
                        color="inherit"                        
                        sx={ phoneMode ? sxSelected : null }
                    >
                        <PhoneIphoneIcon fontSize='small'/>
                    </IconButton>
                    </Stack>

                    <Button
                        color="inherit"
                        size="large"
                        onClick={handleExit}
                        endIcon={<ExitToAppIcon/>}
                    >
                        Back to editor
                    </Button>
                </Toolbar>
            </AppBar>
            
            <div className={classes.toolbar}></div>

            { phoneMode ? phoneScreen() : children }            
        </>
  )
}

//export default withGlobalState(Preview)
export default Preview