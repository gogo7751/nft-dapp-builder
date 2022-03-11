import React, { useState, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormGroup, FormControlLabel, Checkbox  } from '@mui/material'
import AlertMessage from './Alert'
import Gap from './Gap'

const useStyles = makeStyles((theme) => ({
    label: {
        fontSize: '12px',
        marginLeft: '30px',
        marginTop: '-4px',
        marginBottom: '14px',
        // fontWeight: 'bold',
        opacity:0.3
    },
}))

export default function SalePhaseDialog({ salePhaseIndex, salePhase, openDialog, setOpenDialog, handleAction, editable }) {
    const classes = useStyles()    
    const [mintPrice, setMintPrice] = useState(null)
    const [mysteryBox, setMysteryBox] = useState(null)
    const [whitelist, setWhitelist] = useState(null)
    const [holdToken, setHoldToken] = useState(null)
    const [holdTokenContract, setHoldTokenContract] = useState(null)
    const [alert, setAlert] = useState("")

    useEffect(()=> {
        setMintPrice(salePhase?.mint_price)
        setMysteryBox(salePhase?.mystery_box)
        setWhitelist(salePhase?.whitelist)
        setHoldToken(salePhase?.hold_token)
        setHoldTokenContract(salePhase?.hold_token_contract)
    }, [salePhase])

    const handleClose = () => {
        setMintPrice(salePhase?.mint_price)
        setMysteryBox(salePhase?.mystery_box)
        setWhitelist(salePhase?.whitelist)
        setHoldToken(salePhase?.hold_token)
        setHoldTokenContract(salePhase?.hold_token_contract)
        setOpenDialog(false)
    }

    const handleUpdate = async () => {
        if(mintPrice === "" || mintPrice === undefined) {
            setAlert("Please enter mint price")
        }        
        else {
            if((holdToken === true) && (holdTokenContract === "" || holdTokenContract === undefined)) {
                setAlert("Please enter token contract address")
                return
            }
            handleAction({
                amount: salePhase?.amount,
                mint_price: mintPrice === undefined ? "" : mintPrice,
                mystery_box: mysteryBox === undefined ? "" : mysteryBox,
                whitelist: whitelist === undefined ? "" : whitelist,
                hold_token: holdToken === undefined ? "" : holdToken,
                hold_token_contract: holdTokenContract === undefined ? "" : holdTokenContract
            })
            setOpenDialog(false)
        }
    }

    return (
        <Dialog 
            open={openDialog} 
            onClose={handleClose} 
            maxWidth={'xs'} 
            fullWidth={true}
        >
            <DialogTitle>Sale Phase {salePhaseIndex + 1}</DialogTitle>

            <DialogContent>
                <TextField
                    margin="dense"
                    id="amount"
                    label="Amount"          
                    fullWidth
                    autoComplete = "off" 
                    variant="outlined"                    
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    disabled
                    value={salePhase?.amount ? salePhase?.amount : "0"}
                />

                <Gap/>

                <TextField
                    margin="dense"
                    id="mint_price"
                    label="Mint Price"          
                    fullWidth
                    autoComplete = "off" 
                    variant="outlined"                    
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => { setMintPrice(e.target.value) }}
                    size="small"
                    disabled={!editable}
                    value={mintPrice ? mintPrice : ""}
                />

                <Gap/>

                <FormGroup>
                <Gap/>

                {/* Mystery Box */}
                <FormControlLabel 
                    control={<Checkbox checked={mysteryBox} onChange={(e) => setMysteryBox(e.target.checked)} disabled={!editable}/>} 
                    label="Mystery Box" 
                />
                <div className={classes.label}>Control mystery box switch to reveal NFT content</div>
                                    
                {/* Whitelist */}
                <FormControlLabel 
                    control={<Checkbox checked={whitelist} onChange={(e) => setWhitelist(e.target.checked)} disabled={!editable}/>} 
                    label="Whitelist access" 
                />
                <div className={classes.label}>Only whitelisted addresses allow to mint.</div>

                {/* Hold Token */}
                <FormControlLabel 
                    control={<Checkbox checked={holdToken} onChange={(e) => setHoldToken(e.target.checked)} disabled={!editable}/>} 
                    label="Token Access" 
                />
                <div className={classes.label}>Only specific ERC20/ERC721 token owners allow to mint.</div>

                {
                    holdToken &&
                        <TextField 
                            sx={{marginLeft:"20px", marginTop:"4px", width: "360px" }}                   
                            margin="dense"
                            id="name"
                            label="Token contract address"
                            fullWidth
                            autoComplete = "off" 
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            disabled={!editable}
                            onChange={(e) => { setHoldTokenContract(e.target.value) }}
                            value={holdTokenContract ? holdTokenContract : ""}
                        />
                }
                
                </FormGroup>
            </DialogContent>

            <DialogActions>
                {
                    editable ? <>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleUpdate}>Ok</Button>
                    </> :
                    <Button onClick={handleClose}>Ok</Button>
                }
                
            </DialogActions>

            {/* Alert */}
            <AlertMessage alertState={{alert, setAlert}}/>
        </Dialog>      
    )
}
