import React, { useState } from 'react'
import { InputLabel, MenuItem, FormControl, Select, ListSubheader, Divider } from '@mui/material'
import { networks } from '../networks'

function Selector({label, items, gutterTop, gutterBottom, currentValue}) {
    const [value, setValue] = useState(currentValue)
    const sx = {}
    if(gutterTop) sx["marginTop"] = 4
    if(gutterBottom) sx["marginBottom"] = 4

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    return (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                sx={sx}
                value={value}
                label={label}
                color='secondary'
                onChange={handleChange}
            >
                {
                    items.map((item, index) => (
                        <MenuItem value={item.value} key={index}>
                            { item.label }
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>                     
    )
}


function NetworkSelector({gutterTop, gutterBottom, currentValue}) {
    const [value, setValue] = useState(currentValue)
    const sx = {}
    if(gutterTop) sx["marginTop"] = 4
    if(gutterBottom) sx["marginBottom"] = 4

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    return (
        <FormControl fullWidth sx={sx} color='secondary'>
            <InputLabel>Network</InputLabel>
            <Select
                value={value}
                label='Network'
                
                onChange={handleChange}
            >
                <ListSubheader>Mainnet</ListSubheader>  
                {
                    networks.mainnet.map(network => (
                        <MenuItem value={network.chainId} key={network.chainId}>
                            { network.networkName }
                        </MenuItem>
                    ))
                }

                <Divider/>

                <ListSubheader>Testnet</ListSubheader>                
                {
                    networks.testnet.map(network => (
                        <MenuItem value={network.chainId} key={network.chainId}>
                            { network.networkName }
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>                     
    )
}

export { Selector, NetworkSelector }