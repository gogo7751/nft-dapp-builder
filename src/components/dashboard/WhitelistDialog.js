import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { ethers } from 'ethers';
import AlertMessage from '../Alert';

const isValidContractAddress = (address) => {
    try {
      // Will trigger error if address not valid
      ethers.utils.getAddress(address);
      return true;
    } catch {
      return false;
    }
};

export default function WhitelistDialog({salePhase, openDialog, setOpenDialog, whitelist, setWhitelist, handleAction}) {
    const [alert, setAlert] = useState('')
    const orgWhitelist = useRef('')

    useEffect(() => {
        if(openDialog) {
            orgWhitelist.current = whitelist
        }
    }, [openDialog])    

    const handleSave = () => {
        const addresses = whitelist.split('\n')
        let checkedAddresses = []
        let checkedWhitelist = ''

        // check addresses...
        for (let i = 0; i < addresses.length; i++) {
            const address = addresses[i]
            if(address === "" || checkedAddresses.includes(address)) { continue }
            
            if(isValidContractAddress(address) === false) {
                setAlert('Invalid address: ' + address)
                return
            }

            checkedAddresses.push(address)
            checkedWhitelist += address + '\n'
        }

        setOpenDialog(false)
        handleAction(checkedWhitelist, orgWhitelist.current !== whitelist, checkedAddresses.length)
    }

    const handleClose = () => {
        setOpenDialog(false)
    }

    return (
        <Dialog
            maxWidth={'sm'} 
            fullWidth={true}
            open={openDialog}
            onClose={handleClose}
        >
            <DialogTitle>Edit Whitelist ({salePhase?.name})</DialogTitle>

            <DialogContent>
                <TextField
                margin="dense"
                id="name"
                label="Enter addresses"
                autoFocus
                fullWidth
                multiline
                maxRows={20}
                autoComplete="off"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps = {{ spellCheck: false }}
                onChange={(e) => { if(salePhase?.completed === false) setWhitelist(e.target.value) }}
                size="small"
                value={whitelist}
                />                
            </DialogContent>

            <DialogActions>
                {salePhase?.completed ? (
                    <Button onClick={handleClose}>Close</Button>
                ) : 
                (<>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </>
                )}
            </DialogActions>

            {/* Alert */}
            <AlertMessage alertState={{ alert, setAlert }} />
        </Dialog>
    );
}
