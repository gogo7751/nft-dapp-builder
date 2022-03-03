import React from 'react'
import { Container } from '@mui/material'
import { Label } from '../Label'
import Panel from '../Panel'
import TextInput from '../TextInput'

export default function MintInfo() {
    return (
        <Container maxWidth="md">
            
            <Panel>
                <Label gutterBottom>
                    Mint Section
                </Label>

                <TextInput 
                    label="Mint section title" 
                    placeholder="Enter title"
                    field="mint_section"
                    subField = "title"
                    gutterBottom
                />                

                <TextInput 
                    label="Mint section sub-title" 
                    placeholder="Enter sub-title"
                    field="mint_section"
                    subField = "subtitle"
                />

            </Panel>
        </Container>
  )
}