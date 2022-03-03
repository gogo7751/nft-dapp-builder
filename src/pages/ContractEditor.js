import React, { useState } from 'react'
import { Container, Divider, Typography } from '@mui/material'
import { Label } from '../components/Label'
import { NetworkSelector } from '../components/Selector'
import Panel from '../components/Panel'
import TextInput from '../components/TextInput'


export default function ContractEditor() {
    const [networkId, setNetworkId] = useState(null)
  
    return (
        <>
            <Typography variant='h4' sx={{marginLeft: 2, marginBottom: 2}}>
                Smart Contract
            </Typography>

            <Container maxWidth="md">            
                <Panel>
                    <Label gutterBottom>
                        Contract Info
                    </Label>

                    <NetworkSelector 
                        value={networkId}
                        setValue={setNetworkId}
                        field="contract"
                        subField = "network"
                        gutterBottom
                    />

                    <TextInput 
                        label="Token name" 
                        placeholder="Enter token name"
                        field="contract"
                        subField = "token_name"
                        gutterBottom
                    />

                    <TextInput 
                        label="Token symbol" 
                        placeholder="Enter token symbol"
                        field="contract"
                        subField = "token_symbol"
                        gutterBottom
                    />

                    <Divider/>

                    <Label gutterTop gutterBottom>
                        Sale Phases
                    </Label>

                    <TextInput 
                        label="Max quantity per mint" 
                        placeholder="Enter max quantity per mint"
                        field="contract"
                        subField = "max_quantity"
                    />
                </Panel>
            </Container>
        </>
    );
}