import React, { useState } from 'react'
import { Grid, Button, Box, Container, Typography, Stack, Divider, Paper  } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { grey } from '@mui/material/colors'
import Gap from '../components/Gap'
import AlertMessage from '../components/Alert'
import Panel from '../components/Panel'
import AssetsPanel from '../components/dashboard/AssetsPanel'
import ContractPanel from '../components/dashboard/ContractPanel'
import WebsitePanel from '../components/dashboard/WebsitePanel'
import SalesPanel from '../components/dashboard/SalesPanel'
import { Label } from '../components/Label'
import DownloadIcon from '@mui/icons-material/Download'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'

const useStyles = makeStyles((theme) => ({
    div: {
        marginTop: '-10px',
        width: `calc(100% - 280px)`,
        height: '68px',
        position: 'fixed',
        backgroundColor: '#fff',
        zIndex: 9,
    },
    line: {
        height: '1px',
        backgroundColor: '#f0f0f0',
    },
    btn: {
        color: grey[500],
    }
}))

const sxLabel = {
    fontSize: '16px',
    // fontWeight: 'bold',
    color:  grey[400],
}

const sxContainer = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > :not(style)': {
        m: 3,
        width: 180,
        // height: 128,
    },
}

export default function Assets() {
    const classes = useStyles()
    const [alert, setAlert] = useState('')

    const displayInfoPanel = () =>  {
        return (
            <>
            {/* <Panel top={-1}>
                <Stack alignItems='center'>
                    <PhotoLibraryIcon style={{ fontSize: 140, color: grey[300]  }} />
                    <Gap height='20px'/>
                    <Label sx={sxLabel}>You have not added any assets yet, let's add your collection to get started!</Label>                                            
                </Stack>                
            </Panel> */}

            <Panel top={0}>
                {/* <Divider/> */}
                {/* <Gap height='20px'/> */}

                <Label>How to create NFT collection?</Label>

                <Typography>
                Step 1. Download NFT image generator
                </Typography>

                <Box sx={sxContainer}>
                    <Paper elevation={1}>
                        <Stack alignItems='center'>
                            <Gap height='20px'/>
                            <i className="fab fa-windows" style={{fontSize: '3rem', color:'#aaa'}}></i>
                            <Gap height='10px'/>
                            <Typography className={classes.btn} variant='h6'>Windows</Typography>
                            <Typography className={classes.btn} variant='caption'>Windows 64-BIT</Typography>
                            <Gap height='10px'/>
                            <Button 
                                sx={{width:'85%'}}
                                variant='contained'
                            >
                                Download
                            </Button>
                            <Gap height='15px'/>
                        </Stack>
                    </Paper>

                    <Paper elevation={1}>
                        <Stack alignItems='center'>
                            <Gap height='20px'/>
                            <i className="fab fa-apple" style={{fontSize: '3rem', color:'#aaa'}}></i>
                            <Gap height='10px'/>
                            <Typography className={classes.btn} variant='h6'>Mac OS</Typography>
                            <Typography className={classes.btn} variant='caption'>Mac 64-BIT</Typography>
                            <Gap height='10px'/>
                            <Button 
                                sx={{width:'85%'}}
                                variant='contained'
                            >
                                Download
                            </Button>
                            <Gap height='15px'/>
                        </Stack>
                    </Paper>                                     
                </Box>
          
                <Gap height='20px'/>
                <Typography>
                Step 2. Upload NFT collection 
                </Typography>


            </Panel>
            </>
        )
    }
  
    return (
        <>
            <div className={classes.div}>
                <Gap />
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="h4" sx={{ marginLeft: 2, marginBottom: 2 }}>
                        NFT Collection
                    </Typography>

                    <Box display="flex" bgcolor="info.main" sx={{marginRight: 0, marginTop: 2.0}}>
                        {/* <Button 
                            variant='outlined' 
                            endIcon={<DownloadIcon/>}
                            sx={{marginLeft: 2, marginTop: -1.35, marginBottom: 2}}>
                                Withdraw
                        </Button> */}
                    </Box>
                    
                </Box>
                <div className={classes.line}></div>
            </div>
  
            <Gap height="100px" />
  
            <Container maxWidth="md">
            {/* <Container maxWidth="lg" sx={{width: 700}}> */}
        
                { displayInfoPanel() }

                {/* Alert */}
                <AlertMessage alertState={{ alert, setAlert }} />
            </Container>
        </>
    )
}