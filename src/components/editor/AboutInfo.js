import React from 'react'
import { Container } from '@mui/material'
import { Label } from '../Label'
import Panel from '../Panel'
import TextInput from '../TextInput'

export default function AboutInfo() {
    return (
        <Container maxWidth="md">
            
            <Panel>
                <Label gutterBottom>
                    About Section
                </Label>

                <TextInput 
                    label="About section title" 
                    placeholder="Enter title"
                    field="description_sction"
                    subField = "title"
                    gutterBottom
                />                

                <TextInput 
                    label="Description" 
                    placeholder="Enter description"
                    field="description_sction"
                    subField = "desc"
                    gutterBottom
                    multiline
                />

                <TextInput 
                    label="Youtube link" 
                    placeholder="Enter youtube link"
                    field="description_sction"
                    subField = "youtube"
                />    

            </Panel>
        </Container>
  )
}