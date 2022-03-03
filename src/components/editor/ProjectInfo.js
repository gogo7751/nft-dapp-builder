import React from 'react'
import { Container } from '@mui/material'
import { Label } from '../Label'
import Panel from '../Panel'
import TextInput from '../TextInput'

export default function ProjectInfo() {
    return (
        <Container maxWidth="md">
            
            <Panel>
                <Label gutterBottom>
                    Project
                </Label>

                <TextInput 
                    label="Project name" 
                    placeholder="Enter project name"
                    field="project_info"
                    subField = "name"
                    gutterBottom
                />                

                <TextInput 
                    label="Marketplace link" 
                    placeholder="Enter marketplace link"
                    field="project_info"
                    subField = "marketplace_link"
                    gutterBottom
                />

                <TextInput 
                    label="Whitepaper link" 
                    placeholder="Enter whitepaper link"
                    field="project_info"
                    subField = "whitepaper_link"
                    gutterBottom
                />

                <TextInput 
                    label="Copyright" 
                    placeholder="Enter copyright"
                    field="project_info"
                    subField = "copyright"
                />
            </Panel>
        </Container>
  )
}