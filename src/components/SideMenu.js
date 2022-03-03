import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { Drawer, Typography, List, ListItem, ListItemText, ListItemIcon, Stack, IconButton } from '@mui/material'

import HomeIcon from '@mui/icons-material/Home'
import ImageIcon from '@mui/icons-material/Image';
import LanguageIcon from '@mui/icons-material/Language'
import ArticleIcon from '@mui/icons-material/Article'
import SettingsIcon from '@mui/icons-material/Settings'

import HelpIcon from '@mui/icons-material/Help'
import YouTubeIcon from '@mui/icons-material/YouTube'
import TwitterIcon from '@mui/icons-material/Twitter'

const drawerWidth = 220
const menuItemHeight = 60

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,        
    },
    drawerPaper: {
        width: drawerWidth,
    },
}))

const sxBackground = {
    backgroundColor: '#F7F6F3',
}

const sxItem = {
    height: menuItemHeight
}

const sxItemSelected = {    
    height: menuItemHeight,
    backgroundColor: 'grey.200',
    //color: 'primary.main',
}

const sxIcon = {
    marginLeft:2, 
    marginRight:-2.5,     
    color:'secondary.main',
}

const sxIconSelected = {
    marginLeft:2, 
    marginRight:-2.5,     
    color:'primary.main',
}

const sxText = {
    fontWeight: 400,
    variant: 'body3',
    color:'secondary.main',
}

const sxTextSelected = {
    fontWeight: 600,
    variant: 'body3',
    color:'primary.main',
}

const sxBottomPanel = {
    position: 'absolute',
    width: '100%',
    height: 50,
    bottom: 0,
    backgroundColor: '#E8E5E5',
}

export default function SideMenu() {
    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <HomeIcon fontSize='small'/>,
            path: '/dashboard'
        },
        {
            text: 'Assets',
            icon: <ImageIcon fontSize='small'/>,
            path: '/assets'
        },
        {
            text: 'Website',
            icon: <LanguageIcon fontSize='small'/>,
            path: '/website'
        },
        {
            text: 'Smart Contract',
            icon: <ArticleIcon fontSize='small'/>,
            path: '/contract'
        },
        {
            text: 'Settings',
            icon: <SettingsIcon fontSize='small'/>,
            path: '/settings'
        }
    ]

    const bottomMenuItems = [
        {
            icon: <HelpIcon fontSize='small'/>,
            path: '/'
        },
        {
            icon: <YouTubeIcon fontSize='small'/>,
            path: '/'
        },
        {
            icon: <TwitterIcon fontSize='small'/>,
            path: '/'
        },
        {
            icon: <i className="fab fa-discord" style={{fontSize: '1.1rem',}}></i>,
            path: '/'
        }
    ]

    return (
        <Drawer 
            className={classes.drawer}
            variant='permanent'
            anchor='left'
            classes={{ paper: classes.drawerPaper }}
            PaperProps={{ sx: sxBackground }}
        >
            <div>
                <Typography variant='h4' sx={{ m: 2 }}>
                    LOGO
                </Typography>
            </div>

            <List>
                { menuItems.map(item => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => history.push(item.path) }
                        sx= { location.pathname === item.path ? sxItemSelected : sxItem }                        
                    >
                        <ListItemIcon 
                            sx= { location.pathname === item.path ? sxIconSelected : sxIcon }
                        >
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primaryTypographyProps={ location.pathname === item.path ? sxTextSelected : sxText }
                            primary={item.text}
                        />
                    </ListItem>
                )) }
            </List>
            
            
            <Stack
                direction="row" 
                alignItems="center" 
                justifyContent="center"
                spacing={1}
                sx={sxBottomPanel}
            >
                { bottomMenuItems.map((item, index) => (
                    <IconButton 
                        onClick={() => history.push(item.path) }
                        sx={{color:'#848282'}}
                        key={index}
                    >
                        {item.icon}
                    </IconButton>
                )) }           
            </Stack>
        </Drawer>
  )
}