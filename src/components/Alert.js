import React from 'react'
import { Snackbar, Alert  } from '@mui/material'

export default function AlertMessage({alertState}) {
    const { alert, setAlert, severity } = alertState

    const handleClose = () => {
        setAlert("")
    }

    return (
        <Snackbar open={ alert === "" ? false : true } autoHideDuration={6000} onClose={handleClose}>
            <Alert 
                onClose={handleClose} 
                severity={severity ? severity : "error" }
                variant="filled"
                sx={{ width: '100%' }}
            >
                { alert }
            </Alert>
        </Snackbar>
  )
}