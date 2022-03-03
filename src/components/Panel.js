import { Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(4),
        boxShadow: '0px 0px 25px rgba(0,0,0,0.1)',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    }
}));

export default function Panel({children}) {
    const classes = useStyles()
    return (
        <Paper 
            className={classes.paper} 
            variant='outlined' 
            sx={{ borderRadius: 4 }}
        >
            {children}       
        </Paper>
  )
}