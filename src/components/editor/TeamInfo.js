import React from 'react'
import { Container, Box } from '@mui/material'
import { Label } from '../Label'
import Panel from '../Panel'
import TextInput from '../TextInput'
import Switch from '../Switch'

export default function TeamInfo() {
    return (
        <Container maxWidth="md">
            
            <Panel>
            {/* bgcolor="primary.main" */}
                <Box display="flex" justifyContent="space-between" >
                    <Label gutterBottom>
                        Team Section
                    </Label>

                    <Switch
                        label="Show section" 
                        field="team_section"
                        subField = "display"
                    />
                </Box>

                <TextInput 
                    label="Roadmap section title" 
                    placeholder="Enter title"
                    field="team_section"
                    subField = "title"
                    gutterBottom
                />                

                <TextInput 
                    label="Roadmap section sub-title" 
                    placeholder="Enter sub-title"
                    field="team_section"
                    subField = "subtitle"
                />

            </Panel>
        </Container>
  )
}