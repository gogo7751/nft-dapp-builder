//import React, { useState, useEffect, useContext } from 'react'
import React from 'react'
import { IconButton, Button, Box, Container, Stepper, Step, StepButton, Divider  } from '@mui/material'
import { Label } from '../Label'
import Panel from '../Panel'
import Gap from '../Gap'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const steps = ['Pre Sale', 'Whitelist Sale', 'VVIP Sale', 'Public Sale']

export default function SalesPanel() {
    const sxTitle = {
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px',
        marginLeft: '20px',
    }

    const sxSubTitle = {
        fontSize: '14px',
        marginTop: '8px',
        marginBottom: '10px',
        marginLeft: '20px',
        color: '#999999',
    }
  
    return (
        <>
            <Panel top={1}>                    
                <Box display="flex" justifyContent="space-between">          
                    <Label gutterBottom>Sales Control</Label>
                        <Button
                            variant="contained"
                            sx={{ marginTop:-1, height: '35px' }}
                            // onClick={() => deployContract()}
                            // startIcon={<PlayCircleOutlineIcon/>}
                            endIcon={<CheckCircleOutlineIcon/>}
                            disabled={false}
                        >
                            End Whitelist sale
                        </Button>
                </Box>

                <Gap/>

                <Stepper nonLinear activeStep={1} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={label} completed={index < 1 ? true : false}>
                            {/* <StepButton color="inherit" onClick={handleStep(index)}> */}
                            <StepButton color="inherit">
                                {label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>



                <Gap height="50px"/>

                <Box display="flex"  justifyContent="center" >
                    <IconButton sx={{ marginTop:-2, marginBottom: 2}}>
                        <ArrowLeftIcon fontSize="large" />
                    </IconButton>
                    
                    <Label>Whitelist Sale (on sale)</Label>
                    
                    <IconButton sx={{ marginTop:-2, marginBottom: 2}}>
                        <ArrowRightIcon fontSize="large" />
                    </IconButton>
                </Box>

                
                <Container maxWidth="sm" sx={{marginTop:-2}}>

                    {/* Sales time */}
                    <Box display="flex" justifyContent="space-between">          
                        <Box>
                            <Label sx={sxTitle}>Sales Time</Label>
                            <Label sx={sxSubTitle}>2021/3/1  08:00 GMT+8  ~  2021/3/1  08:00 GMT+8</Label>
                        </Box>
                        
                        <Button
                            sx={{ marginTop:2.5, height: '35px' }}
                            disabled={false}
                        >
                            edit
                        </Button>
                    </Box>
                    
                    <Divider/>

                    {/* Whitelist */}
                    <Box display="flex" justifyContent="space-between">          
                        <Box>
                            <Label sx={sxTitle}>Whitelist</Label>
                            <Label sx={sxSubTitle}>Addresses: 200</Label>
                        </Box>

                        <Button
                            sx={{ marginTop:2.5, height: '35px' }}
                            // onClick={() => deployContract()}                            
                            // endIcon={<EditIcon/>}
                            disabled={false}                            
                        >
                            edit
                        </Button>
                    </Box>

                    <Divider/>

                    {/* Mint */}
                    <Box display="flex" justifyContent="space-between">          
                        <Box>
                            <Label sx={sxTitle}>Mint</Label>
                            <Label sx={sxSubTitle}>Minted: 200 / 1000</Label>
                        </Box>

                        <Button
                            sx={{ marginTop:2.5, height: '35px' }}
                            // onClick={() => deployContract()}                                                        
                            disabled={false}                            
                        >
                            Reserve
                        </Button>
                    </Box>                        
                    
                    <Divider/>

                    {/* Mystery Box */}
                    <Box display="flex" justifyContent="space-between">          
                        <Box>
                            <Label sx={sxTitle}>Mystery Box</Label>
                            <Label sx={sxSubTitle}>Open mystery box  to reveal NFT content</Label>
                        </Box>
                        
                        <Button
                            sx={{ marginTop:2.5, height: '35px' }}
                            // onClick={() => deployContract()}                            
                            disabled={false}                            
                        >
                            open
                        </Button>
                    </Box>            

                </Container>

            </Panel>
        </>
    )
}