//import React, { useState, useEffect, useContext } from 'react'
import React from 'react'
import { Box  } from '@mui/material'
import { Label } from '../Label'
import Panel from '../Panel'
import Switch from '../Switch'

export default function WebsitePanel() {
    const sxLabel = {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#999999',
    }
  
    return (
        <>
            <Panel top={2} height={8}>
                <Box display="flex" justifyContent="space-between">
                    <Label>Website</Label>

                    <Switch
                        sx= {{marginTop: -3, paddingRight: -2 }}
                        label="live"
                        field="website"
                        subField="live"
                    />
                </Box>
                <Label sx={sxLabel}>Link</Label>
            </Panel>
        </>
    )
}