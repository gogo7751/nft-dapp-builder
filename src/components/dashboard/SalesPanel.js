//import React, { useState, useEffect, useContext } from 'react'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { IconButton, Button, Box, Container, Stepper, Step, StepButton, Divider  } from '@mui/material'
import { UserContext } from '../../UserContext'
import { Label } from '../Label'
import Panel from '../Panel'
import Gap from '../Gap'
import AlertMessage from '../Alert'
import WhitelistDialog from './WhitelistDialog'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import StorageService from '../../services/StorageService'
import ProjectDataService from '../../services/ProjectDataService'

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

const salePhaseStateLabel = {
    'CLOSED' : ' (closed)',
    'ON_SALE' : ' (on sale)',
    'NOT_OPENED' : ''
}

export default function SalesPanel() {
    const { project, setProject, setLoading } = useContext(UserContext)
    const [salePhase, setSalePhase] = useState(null)
    const [whitelist, setWhitelist] = useState('')
    const [openWhitelistDialog, setOpenWhitelistDialog] = useState(false)
    const [alert, setAlert] = useState('')

    const salePhases = useRef(null)
    const selected = useRef(0)
    const currentPhase = useRef(0)
    const projectName = useRef(null)
    
    useEffect(() => {
        try {
            const data = project['contract']
            if(data !== undefined) {
                salePhases.current = data?.sale_phases
                currentPhase.current = data?.current_sale_phase
                if(projectName.current !== project?.name) {
                    projectName.current = project?.name
                    selected.current = data?.current_sale_phase
                    setSalePhase(salePhases.current[currentPhase.current])
                }
            }       
        } catch (error) {
        }
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project])

    const handleSelectPreviousSalePhase = () => {
        selected.current--
        if(selected.current < 0) {
            selected.current = 0
        }
        setSalePhase(salePhases.current[selected.current])
    }

    const handleSelectNextSalePhase = () => {
        selected.current++
        if(selected.current >= salePhases.current.length) {
            selected.current = salePhases.current.length - 1
        }
        setSalePhase(salePhases.current[selected.current])
    }

    const loadWhitelist = async () => {
        const whitelistUrl = salePhase?.whitelist_url
        if(whitelistUrl === undefined) {
            if(getSaleState() === 'CLOSED') {
                setAlert('No whitelist available')
            }
            else {
                setWhitelist('')
                setOpenWhitelistDialog(true)
            }            
        }
        else {
            setLoading(true)
    
            const response = await fetch(whitelistUrl)
            const text = await response.text()
            setLoading(false)
            
            setWhitelist(text)
            setOpenWhitelistDialog(true) 
        }
    }

    const handleUpdateWhitelist = (newWhitelist, isUpdated, addressNumber) => {
        if(isUpdated === false) { return }
                
        const fileName = project?.project_id + '_' + selected.current
        setLoading(true)
        StorageService.uploadWhitelist(fileName, newWhitelist, (whitelistURL) => {
            const updatedSalePhase = {...salePhase,
                ['whitelist_url']: whitelistURL,
                ['whitelist_numbers']: addressNumber,
            }            
            setSalePhase(updatedSalePhase)

            const updatedSalePhases = [...salePhases.current]
            updatedSalePhases[selected.current] = updatedSalePhase
            salePhases.current = updatedSalePhases

            const data = project['contract']
            const newProjectData = {
                ...project,
                contract: { ...data, sale_phases: updatedSalePhases },
            }

            setProject(newProjectData)
            ProjectDataService.updateProjectData(newProjectData)
            setLoading(false)
        })
    }

    const handleEndSalePhase = async () => {
    }

    const getSalesTimeString = () =>  {
        if(salePhase === null) return
        const beginDate = new Date(salePhase?.begin_date * 1000)
        const endDate = new Date(salePhase?.end_date * 1000)
        return beginDate.toLocaleString() + ' ~ ' + endDate.toLocaleString()
    }

    const getSaleState = () => {
        if(selected.current === currentPhase.current)
            return 'ON_SALE'
        else if(salePhase?.completed)
            return 'CLOSED'
        else
            return 'NOT_OPENED'
    }

    const salePhaseStepControl = () => {
        if(salePhases.current === null || salePhases.current.length <= 1 ) return (<></>)
        
        return (
            <>
                <Stepper nonLinear activeStep={currentPhase.current} alternativeLabel>
                    {salePhases.current.map((phase, index) => (
                        <Step key={index} completed={phase.completed}>
                            <StepButton 
                                color="inherit"
                                onClick={() => {
                                    selected.current = index
                                    setSalePhase(salePhases.current[selected.current])
                                }}
                            >
                                {phase.name}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>

                <Gap height="50px"/>

                <Box display="flex"  justifyContent="center" >
                    <IconButton 
                        sx={{ marginTop:-2, marginBottom: 2}}
                        onClick={handleSelectPreviousSalePhase}
                        disabled={selected.current === 0}
                    >
                        <ArrowLeftIcon fontSize="large" />
                    </IconButton>
                    
                    <Label>{salePhase?.name + salePhaseStateLabel[getSaleState()]}</Label>
                    
                    <IconButton 
                        sx={{ marginTop:-2, marginBottom: 2}}
                        onClick={handleSelectNextSalePhase}
                        disabled={selected.current === (salePhases.current.length - 1)}
                    >
                        <ArrowRightIcon fontSize="large" />
                    </IconButton>
                </Box>
            </>
        )
    }


    const whitelistControl = () =>  {
        if(salePhases.current === null || salePhase?.whitelist === false || salePhase?.whitelist === null) return (<></>)

        const whitelistNumbers = salePhase?.whitelist_numbers ? salePhase?.whitelist_numbers : '0'
        return (
            <>
            <Box display="flex" justifyContent="space-between">          
                <Box>
                    <Label sx={sxTitle}>Whitelist</Label>
                    <Label sx={sxSubTitle}>{whitelistNumbers} addresses</Label>
                </Box>

                <Button
                    sx={{ marginTop:2.5, height: '35px' }}                            
                    onClick={() => { loadWhitelist() }}                  
                >
                    { getSaleState() === 'CLOSED' ? 'view' : 'edit'}
                </Button>
            </Box>

            <Divider/>
            </>
        )        
    }


    const mysteryBoxControl = () => {
        if(salePhases.current === null || salePhase?.mystery_box === false || salePhase?.mystery_box === null) return (<></>)

        return (
            <>
            <Box display="flex" justifyContent="space-between">          
                <Box>
                    <Label sx={sxTitle}>Mystery Box</Label>
                    <Label sx={sxSubTitle}>Open mystery box  to reveal NFT content</Label>
                </Box>
                
                <Button
                    sx={{ marginTop:2.5, height: '35px' }}
                    disabled={false}                            
                >
                    reveal
                </Button>
            </Box>

            <Divider/>
            </>
        )
    }

    return (
        <>
            <Panel top={1}>                    
                <Box display="flex" justifyContent="space-between">          
                    <Label gutterBottom>Sales Control</Label>
                        {/* <Button
                            variant="contained"
                            sx={{ marginTop:-1, height: '35px' }}
                            onClick={handleEndSalePhase}
                            // startIcon={<PlayCircleOutlineIcon/>}
                            endIcon={<CheckCircleOutlineIcon/>}
                            disabled={false}
                        >
                            End Whitelist sale
                        </Button> */}
                </Box>

                <Gap/>

                { salePhaseStepControl() }
                
                <Container maxWidth="sm" sx={{marginTop:-2}}>

                    {/* Sales time */}
                    <Box display="flex" justifyContent="space-between">          
                        <Box>
                            <Label sx={sxTitle}>Sales Time (Local)</Label>
                            <Label sx={sxSubTitle}>{getSalesTimeString()}</Label>
                        </Box>
                        
                        <Button
                            sx={{ marginTop:2.5, height: '35px' }}
                            disabled={getSaleState() === 'CLOSED' ? true : false}
                        >
                            edit
                        </Button>
                    </Box>
                    
                    <Divider/>

                    {/* Whitelist */}
                    { whitelistControl() }            

                    {/* Mystery Box */}
                    { mysteryBoxControl() }                    

                    {/* Mint */}
                    <Box display="flex" justifyContent="space-between">          
                        <Box>
                            <Label sx={sxTitle}>Mint</Label>
                            <Label sx={sxSubTitle}>Minted: 200 / 1000</Label>
                        </Box>

                        <Button
                            sx={{ marginTop:2.5, height: '35px' }}
                            disabled={false}                            
                        >
                            Reserve
                        </Button>
                    </Box>                                    

                </Container>

            </Panel>


            <WhitelistDialog
                salePhase={salePhase}
                openDialog={openWhitelistDialog}
                setOpenDialog={setOpenWhitelistDialog}
                whitelist={whitelist}
                setWhitelist={setWhitelist}
                handleAction={handleUpdateWhitelist}
            />

            {/* Alert */}
            <AlertMessage alertState={{ alert, setAlert }} />
        </>
    )
}