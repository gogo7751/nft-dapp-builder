import React from 'react'
import { Container, Grid } from '@mui/material'
import { Label } from '../Label'
import Panel from '../Panel'
import TextInput from '../TextInput'
import ImagePicker from '../ImagePicker'

export default function ProjectInfo() {
    return (
        <Container maxWidth="md">
            
            <Panel>
                <Label gutterBottom>
                    Project
                </Label>

                <Grid container spacing={3}>
                    {/* Logo */}
                    <Grid item md={3} xs={3} sm={3}>
                        <ImagePicker
                            label="Logo Image"
                            maximumSize={0.5}
                            field="project_info"
                            subField="image"
                            height="55%"
                        />
                    </Grid>

                    {/* Info */}
                    <Grid item md={9} xs={9} sm={9}>
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
                    </Grid>
                </Grid>
            </Panel>
        </Container>
  )
}