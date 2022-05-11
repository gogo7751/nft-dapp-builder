//import React, { useState, useEffect, useContext } from 'react'
import React from 'react'
import { Label } from '../Label'
import Panel from '../Panel'

export default function AssetsPanel() {
    const sxLabel = {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#999999',
    }
  
    return (
        <>
            <Panel top={2} height={8}>
                <Label>NFT Collection</Label>
                <Label sx={sxLabel}>Total: 10,000</Label>
            </Panel>
        </>
    )
}