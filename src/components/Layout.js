import React from 'react'
import { useLocation } from 'react-router-dom'
import { makeStyles } from '@mui/styles'

import SideMenu from './SideMenu'
import TopMenu from './TopMenu'


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    page: {
        //backgroundColor: '#f9f9f9',
        width: '100%',
        // padding: theme.spacing(3)
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar
}))

export const layoutPaths = ['/dashboard', '/assets', '/website', '/contract']

const Layout = ({ children }) => {
    const classes = useStyles()
    const location = useLocation()
    
    const layoutEnabled = () => {    
        return (
            <div className={classes.root}>
                <TopMenu/>
                <SideMenu/>
                <div className={classes.page}>
                    <div className={classes.toolbar}></div>
                    { children }                    
                </div>
            </div>   
        )
    }
    
    const layoutDisabled = () => {
        return ( <> { children } </> )    
    }

    return (
        <> {
            layoutPaths.includes(location.pathname) ? layoutEnabled() : layoutDisabled()
        }      
        </>        
  )
}

export default Layout
