//import React, { useState, useEffect, useContext } from 'react'
import React from 'react'
import { IconButton, Box } from '@mui/material'
import { Label } from '../Label'
import Panel from '../Panel'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import LaunchIcon from '@mui/icons-material/Launch';

export default function ContractPanel() {
    const sxLabel = {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#999999',
    }
  
    return (
        <>
            <Panel top={2} height={8}>
                <Label>Smart Contract</Label>
                
                <Box display="flex" >
                    <Label sx={sxLabel}>0xebe9...57E8</Label>

                    <IconButton sx={{marginLeft: 0.5, marginTop:-1.5}}>
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>

                    <IconButton sx={{marginLeft: -0.5, marginTop:-1}}>
                        <LaunchIcon fontSize="small" />
                    </IconButton>
                </Box>

            </Panel>
        </>
    )
}