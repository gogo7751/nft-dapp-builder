import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuItem, Fade } from '@mui/material'
import AccountService from '../services/AccountService'

export default function UserMenu({ userMenuState }) {
    const history = useNavigate()
    const { userMenu, setUserMenu } = userMenuState
    const openSignOut = Boolean(userMenu)    

    const handleSignOut = async () => {
        setUserMenu(null)
        await AccountService.signOut()
        history('/')
    }

    return (
        <Menu        
            anchorEl={userMenu}
            open={openSignOut}
            onClose={() => { setUserMenu(null) }}
            TransitionComponent={Fade}
        >
            <MenuItem sx={{color: 'text.secondary'}} onClick={ handleSignOut }>Logout</MenuItem>
        </Menu>
  )
}