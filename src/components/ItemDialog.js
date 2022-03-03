import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField  } from '@mui/material'
import AlertMessage from './Alert'

export default function ItemDialog({ title, primaryLabel, secondaryLabel, actionLabel, item, openItemDialog, setOpenItemDialog, handleAction }) {
    const [primary, setPrimary] = useState(null)
    const [secondary, setSecondary] = useState(null)
    const [alert, setAlert] = useState("")

    useEffect(()=> {
        setPrimary(item?.primary)
        setSecondary(item?.secondary)
    }, [item])

    const handleClose = () => {
        setPrimary(item?.primary)
        setSecondary(item?.secondary)
        setOpenItemDialog(false)
    }

    const handleAdd = async () => {
        if(primary === "" || primary === undefined) {
            setAlert("Please enter title")
        }
        else {
            handleAction({
                id: item?.id === undefined ? uuidv4() : item?.id,
                primary: primary,
                secondary: secondary === undefined ? "" : secondary
            })
            setOpenItemDialog(false)
        }
    }

    return (
        <Dialog 
            open={openItemDialog} 
            onClose={handleClose} 
            maxWidth={'xs'} 
            fullWidth={true}
        >
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label={primaryLabel}            
                    fullWidth
                    autoComplete = "off" 
                    variant="outlined"                    
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => { setPrimary(e.target.value) }}
                    value={primary ? primary : ""}
                />

                <Box sx={{height:10}}></Box>

                <TextField                    
                    margin="dense"
                    id="name"
                    label={secondaryLabel}
                    fullWidth
                    autoComplete = "off" 
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    rows={4}
                    multiline
                    onChange={(e) => { setSecondary(e.target.value) }}
                    value={secondary ? secondary : ""}
                />
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
