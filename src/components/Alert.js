import React from 'react'
import { Snackbar, Alert  } from '@mui/material'

export default function AlertMessage({alertState}) {
    const { alert, setAlert} = alertState

    const handleClose = () => {
        setAlert("")
    }

    return (
        <Snackbar open={ alert === "" ? false : true } autoHideDuration={6000} onClose={handleClose}>
            <Alert 
                onClose={handleClose} 
                severity="error" 
                sx={{ width: '100%' }}
            >
                { alert }
            </Alert>
        </Snackbar>
  )
}