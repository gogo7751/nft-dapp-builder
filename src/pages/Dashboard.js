import React, { useState } from 'react'
import { Grid, Button, Box, Container, Typography  } from '@mui/material'
import { makeStyles } from '@mui/styles'

import Gap from '../components/Gap'
import AlertMessage from '../components/Alert'
import AssetsPanel from '../components/dashboard/AssetsPanel'
import ContractPanel from '../components/dashboard/ContractPanel'
import WebsitePanel from '../components/dashboard/WebsitePanel'
import SalesPanel from '../components/dashboard/SalesPanel'
import { Label } from '../components/Label'
import DownloadIcon from '@mui/icons-material/Download'

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
}))


export default function Dashboard() {
    const classes = useStyles()
    const [alert, setAlert] = useState('')
  
    return (
        <>
            <div className={classes.div}>
                <Gap />
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="h4" sx={{ marginLeft: 2, marginBottom: 2 }}>
                        Dashboard
                    </Typography>

                    <Box display="flex" bgcolor="info.main" sx={{marginRight: 0, marginTop: 2.0}}>
                        <Label>Balance: 12.3 ETH</Label>

                        <Button 
                            variant='outlined' 
                            endIcon={<DownloadIcon/>}
                            sx={{marginLeft: 2, marginTop: -1.35, marginBottom: 2}}>Withdraw</Button>
                    </Box>
                    
                </Box>
                <div className={classes.line}></div>
            </div>
  
            <Gap height="70px" />
  
            <Container maxWidth="md">

                <Grid container spacing={3}>
                    {/* Assets */}
                    <Grid item md={4} xs={12} sm={12}>
                        <AssetsPanel/>
                    </Grid>

                    {/* Website */}
                    <Grid item md={4} xs={12} sm={6}>
                        <WebsitePanel/>                      
                    </Grid>

                    {/* Smart Contract */}
                    <Grid item md={4} xs={12} sm={6}>
                        <ContractPanel/>
                    </Grid>

                </Grid>

                <SalesPanel/>
            
                {/* Alert */}
                <AlertMessage alertState={{ alert, setAlert }} />
            </Container>
        </>
    )
}