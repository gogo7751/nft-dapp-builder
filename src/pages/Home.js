import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, AppBar, Toolbar, Box, Container, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { grey } from '@mui/material/colors'
import { UserContext } from '../UserContex'
import UserDataService from '../services/UserDataService'
import AccountService from '../services/AccountService'
import AlertMessage from '../components/Alert'
import UserMenu from '../components/UserMenu'
import Panel from '../components/Panel'
import ProjectDialog from '../components/ProjectDialog'

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AddIcon from '@mui/icons-material/Add'
import BackgroundImage from '../images/background.jpg'

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        backgroundImage: `url(${BackgroundImage})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    },
    toolbar: theme.mixins.toolbar
}))

export default function Home() {
    const classes = useStyles()    
    const history = useHistory()

    const { user, setLoading } = useContext(UserContext)
    const [alert, setAlert] = useState("")
    const [userMenu, setUserMenu] = useState(null)
    const [openProjectDialog, setOpenProjectDialog] = useState(false)

    const handleSignin = async () => {
        setLoading(true)

        // get wallet address
        const address = await AccountService.getWalletAddress((error) => {
            setAlert(error.message)
            setLoading(false)
            return
        })

        if( address ) {
            // get nonce for verification
            const nonce = await AccountService.fetchNonce(address)

            // open wallet to sign nonce
            const signature = await AccountService.signNonce(nonce, (error) => {
                setAlert(error.message)
                setLoading(false)
                return
            })

            // send signature for verification and request custom token
            const token = await AccountService.verifySignature({address, signature})

            // use custom token to signin firebase
            await AccountService.signin(token, (error) => {
                setAlert(error.message)
                setLoading(false)
                return
            })

            // get user data
            const userData = await UserDataService.getUserData()
            if(userData.projects) {
                history.push('/website')
            }
        }

        setLoading(false)
    }

    const btnConnect = () => {
        return (
            <Button 
                color="inherit"
                size="large"
                startIcon={ <AccountBalanceWalletIcon/> }
                sx={{fontWeight: 800}}
                onClick={handleSignin}
            >
                Connect Wallet
            </Button>
        )
    }

    const btnAccount = () => {
        const address = user.address
        const formatAddress =  '0' + address?.substr(1, 5) + '...' + address?.substr(address?.length - 4, 4)
        return (
            <Button 
                color="inherit"
                size="large"
                startIcon={ <AccountCircleIcon/> }
                sx={{textTransform: 'none', fontWeight: 800}}
                onClick={(e) => { setUserMenu(e.currentTarget) }}
            >
                {formatAddress}
            </Button>
        )
    }

    const panelConnectWallet = () => {
        return (
            <Panel>
                <Typography
                    sx={{
                        fontWeight: 800,
                        marginTop: 3,
                        marginBottom: 3,
                    }}
                    variant='h5' color='text' align='center'
                >
                    Connect your wallet
                </Typography>

                <Typography variant='h6' align='center' color={grey[500]} gutterBottom>
                    You need to connect your wallet to login
                </Typography>
                <Box textAlign='center'>

                <Button 
                    color="primary"
                    variant='contained'
                    size="large"                    
                    startIcon={ <AccountBalanceWalletIcon/> }
                    sx={{ marginTop: 3,marginBottom:1, fontWeight: 800}}
                    onClick={ handleSignin }
                >
                    Connect Wallet
                </Button>
                </Box>

            </Panel> 
        )
    }

    const panelCreateProject = () => {
        return (
            <Panel>
                <Typography
                    sx={{
                        fontWeight: 800,
                        marginTop: 3,
                        marginBottom: 3,
                    }}
                    variant='h5' color='text' align='center'
                >
                    Let’s build your first project
                </Typography>

                <Typography variant='h6' align='center' color={grey[500]} gutterBottom>
                    Create your NFT project website in minutes
                </Typography>
                <Box textAlign='center'>

                <Button 
                    color="primary"
                    variant='contained'
                    size="large"                    
                    startIcon={ <AddIcon/> }
                    sx={{ marginTop: 3,marginBottom:1, fontWeight: 800}}
                    onClick={() => {setOpenProjectDialog(true)}}
                >
                    Create Project
                </Button>
                </Box>

            </Panel>
        )
    }

    const sxBottomPanel = {
        position: 'absolute',
        width: '100%',
        height: 40,
        bottom: 0,
        backgroundColor: '#f0f0f0',
    }

    return (
        <div className={classes.root}>
            {/* Navigation */}
            <AppBar position="fixed" elevation={0}>
                <Toolbar sx={{justifyContent: "space-between"}}>
                    <Typography variant='h3'>
                        {/* Logo */}
                    </Typography>

                    <Box>
                        { user ? btnAccount() : btnConnect() }
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Appbar offset */}
            <div className={classes.toolbar}></div>

            {/* Login or Create project */}
            <Container maxWidth="sm">
                <Box sx={{height:50}}/>
                { user ? panelCreateProject() : panelConnectWallet() }
            </Container>

            {/* Copyright */}
            <Box sx={sxBottomPanel} display="flex" justifyContent="center" alignItems="center">
                <Typography variant='body2' color={grey[500]}>
                Copyright © 2022 NFTBuilder
                </Typography>
            </Box>

            {/* New Project Dialog */}
            <ProjectDialog openState={{ openProjectDialog, setOpenProjectDialog }}/>

            {/* User Menu */}
            <UserMenu userMenuState={{userMenu, setUserMenu}}/>

            {/* Alert */}
            <AlertMessage alertState={{alert, setAlert}}/>

        </div>
  )
}