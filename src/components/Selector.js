import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../UserContex'
import { InputLabel, MenuItem, FormControl, Select, ListSubheader, Divider } from '@mui/material'
import { networks } from '../networks'
import ProjectDataService from '../services/ProjectDataService'

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


function NetworkSelector({value, setValue, field, subField, gutterTop, gutterBottom, disabled}) {
    const { project, setProject } = useContext(UserContext)
    const sx = {}
    if(gutterTop) sx["marginTop"] = 4
    if(gutterBottom) sx["marginBottom"] = 4

    useEffect(()=> {
        if(field !== null && subField !== null) {
            try {
                const data = project[field]
                setValue(data[subField])
            }
            catch (error) {
                setValue(null)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project, field, subField])

    const handleChange = (event) => {
        const selectedNetworkId = event.target.value
        setValue(selectedNetworkId)

        if(field !== null && subField !== null) {
            const newProjectData = { ...project, [field]: { [subField]: selectedNetworkId }}
            setProject(newProjectData)
            ProjectDataService.updateProjectData(newProjectData)
        }
    }

    return (
        <FormControl fullWidth sx={sx} color='secondary'>
            <InputLabel>Network</InputLabel>
            <Select
                value={value === null ? "" : value}
                label='Network'
                disabled={disabled}
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