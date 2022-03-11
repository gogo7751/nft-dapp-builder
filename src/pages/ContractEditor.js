import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@mui/styles'
import { Button, Box, IconButton, Container, Divider, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { UserContext } from '../UserContex'
import { Label } from '../components/Label'
import { NetworkSelector } from '../components/Selector'
import ProjectDataService from '../services/ProjectDataService'
import Panel from '../components/Panel'
import Gap from '../components/Gap'
import TextInput from '../components/TextInput'
import SalePhaseDialog from '../components/SalePhaseDialog'
import EditIcon from '@mui/icons-material/Edit'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import CheckIcon from '@mui/icons-material/Check'

const useStyles = makeStyles((theme) => ({
    div: {
        marginTop: "-10px",
        width: `calc(100% - 280px)`,
        height: "68px",
        position: "fixed",
        backgroundColor: '#fff',
        zIndex: 9
    },
    line: {
        height: "1px",
        backgroundColor: '#f0f0f0',
    }
}))

const salePhaseTableHeader = ["Sale Phase", "Amount", "Mint Price", "Mystery Box", "Whitelist Access", "Token Access", ""]

const getItemDisplay = (value) => {
    return (
        <>
            {(value === true) ? <CheckIcon fontSize="small"/> : "--"}
        </>
    )
}

export default function ContractEditor() {
    const classes = useStyles()
    const { project, setProject } = useContext(UserContext)
    const [salePhases, setSalePhases] = useState([])
    const [salePhase, setSalePhase] = useState(null)
    const [salePhaseIndex, setSalePhaseIndex] = useState(0)
    const [networkId, setNetworkId] = useState(null)
    const [contractAddress, setContractAddress] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)    

    useEffect(()=> {
        //console.log("initProjectData...")

        try {
            const data = project["contract"]
            setContractAddress(data?.contract_address === undefined ? null : data?.contract_address)
            //console.log("setContractAddress", data?.contract_address)

            const currentSalePhases = data["sale_phases"]
            setSalePhases(currentSalePhases === undefined ? [] : currentSalePhases)
            //console.log("currentSalePhases", currentSalePhases)
        }
        catch (error) {
            setSalePhases([])
        }    

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project])

    const getSalePhaseRow = (item, index) => {        
        return (
            <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{item?.amount}</TableCell>
                <TableCell align="center">{item?.mint_price ? item?.mint_price : "--"}</TableCell>
                <TableCell align="center">{ getItemDisplay(item?.mystery_box) }</TableCell>
                <TableCell align="center">{ getItemDisplay(item?.whitelist) }</TableCell>
                <TableCell align="center">{ getItemDisplay(item?.hold_token) }</TableCell>
                <TableCell>
                    <IconButton onClick={()=>{
                        setSalePhaseIndex(index)
                        setSalePhase(item)
                        setOpenDialog(true)
                    }}>
                        { contractAddress ? <MoreHorizIcon fontSize='small'/> : <EditIcon fontSize='small'/>}
                    </IconButton>
                </TableCell>
            </TableRow>
        )
    }

    const getContractAddress = () => {
        return '0' + contractAddress?.substr(1, 5) + '...' + contractAddress?.substr(contractAddress?.length - 4, 4)
    }

    const handleSalePhaseDialogAction = (updatedSalePhase) => {
        var index = salePhases.indexOf(salePhase)
        const updatedSalePhases = [...salePhases]
        updatedSalePhases[index] = updatedSalePhase
        setSalePhases(updatedSalePhases)

        // save sale phase data
        //console.log("save contract sale phases data", updatedSalePhases)
        const data = project["contract"]
        const newProjectData = { ...project, "contract": { ...data, "sale_phases": updatedSalePhases }}
        setProject(newProjectData)
        ProjectDataService.updateProjectData(newProjectData)
    }    

    return (
        <>
            <div className={classes.div}>
                <Gap/>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant='h4' sx={{marginLeft: 2, marginBottom: 2}}>
                        Smart Contract
                    </Typography>

                    <Button 
                        variant="contained" 
                        sx={{height:"40px"}}
                        startIcon={<RocketLaunchIcon/>}
                    >
                        { contractAddress ? getContractAddress() : "Deploy Contract"}
                    </Button>
                </Box>
                <div className={classes.line}></div>
            </div>

            <Gap height="70px"/>

            <Container maxWidth="md">            
                <Panel>
                    <Label gutterBottom>
                        Contract Settings
                    </Label>

                    <NetworkSelector 
                        value={networkId}
                        setValue={setNetworkId}
                        field="contract"
                        subField = "network"
                        disabled={contractAddress !== null}
                        gutterBottom
                    />

                    <TextInput 
                        label="Token name" 
                        placeholder="Enter token name"
                        field="contract"
                        subField = "token_name"
                        disabled={contractAddress !== null}
                        gutterBottom
                    />

                    <TextInput 
                        label="Token symbol" 
                        placeholder="Enter token symbol"
                        field="contract"
                        subField = "token_symbol"
                        disabled={contractAddress !== null}
                        gutterBottom
                    />

                    <Divider/>

                    <Label gutterTop>
                        Sale Settings
                    </Label>

                    <TextInput 
                        label="Max quantity per mint" 
                        placeholder="Enter max quantity per mint"
                        field="contract"
                        subField = "max_quantity"
                        gutterBottom
                    />
                    
                    { (salePhases.length == 0) ? <></> :
                    <TableContainer component={Box}>
                        <Table aria-label="phase table">
                            
                            <TableHead>
                                {salePhaseTableHeader.map((header, index) => (
                                    <TableCell key={index} align="center">{header}</TableCell>
                                ))}
                            </TableHead>
                            
                            <TableBody>
                                {salePhases.map((phaseItem, index) => getSalePhaseRow(phaseItem, index))}
                            </TableBody>

                        </Table>
                    </TableContainer> }
                </Panel>

                <SalePhaseDialog 
                    salePhase={salePhase}
                    salePhaseIndex={salePhaseIndex}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    handleAction={handleSalePhaseDialogAction}
                    editable={contractAddress === null}
                />
            </Container>
        </>
    );
}