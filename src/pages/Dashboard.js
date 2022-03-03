import { Button, Container, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
import AcUnitIcon from '@mui/icons-material/AcUnit';

const useStyles = makeStyles((theme) => ({
    btn: {
        fontSize: 60
        //color: '#00a87e',
    }
}));

export default function Dashboard() {
    const classes = useStyles()
    return (
        <Container>      
            <Typography 
                variant='h3'             
                color='secondary'
                gutterBottom
            >
                Dashboard page    
            </Typography>

            <Button
                className = { classes.btn }
                variant = 'contained'
                color = 'primary'
                startIcon = { <AcUnitIcon/> }
            >
                Test
            </Button>
        
        </Container>
  )
}