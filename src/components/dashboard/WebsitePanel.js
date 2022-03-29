import React, { useState, useEffect, useContext } from 'react'
import { Box, Button, IconButton } from '@mui/material'
import { UserContext } from '../../UserContext'
import { Label } from '../Label'
import WebsiteLinkDialog from '../WebsiteLinkDialog'
import Panel from '../Panel'
import Switch from '../Switch'
import EditIcon from '@mui/icons-material/Edit'
import LaunchIcon from '@mui/icons-material/Launch'

export default function WebsitePanel() {
    const { project } = useContext(UserContext)
    const [link, setLink] = useState(null)
    const [openLinkDialog, setOpenLinkDialog] = useState(false)

    useEffect(() => {
        try {
            const data = project['website']
            setLink(data['link'])
        } catch (error) {
            setLink(null);
        }
    }, [project])

    const getLinkUrl = () => {
        if(link === null || link === undefined) {
            return ''
        }
        if(link.length > 8) {
            return 'nftpod.app/' + link.substr(0, 7) + '...'
        }
        else {
            return 'nftpod.app/' + link
        }
    }
  
    return (
        <>
            <Panel top={2} height={8}>
                <Box display="flex" justifyContent="space-between">
                    <Label>Website</Label>

                    {
                        (link === null || link === undefined) ? <></> : 
                            <Switch
                                sx= {{marginTop: -3, paddingRight: -2 }}
                                label="live"
                                field="website"
                                subField="live"
                            />
                    }
                </Box>

                {
                    (link === null || link === undefined) ? 
                        // link not exist...
                        <Button 
                            variant='outlined' 
                            fullWidth
                            onClick={()=>{ setOpenLinkDialog(true) }}
                            sx={{marginTop: -0.5}}
                        >
                            publish website
                        </Button> :

                        // link exist...
                        <Box display="flex">
                            <Label sx={{ fontSize: '14px', fontWeight: 'bold', color: '#999999'}}>
                                {getLinkUrl()}
                            </Label>

                            <IconButton 
                                sx={{marginLeft: 0.5, marginTop:-1}}
                                onClick={()=>{ setOpenLinkDialog(true) }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>

                            <IconButton sx={{marginLeft: -0.5, marginTop:-1}}>
                                <LaunchIcon fontSize="small" />
                            </IconButton>
                        </Box>
                }
            </Panel>

            {/* Website Link Dialog */}
            <WebsiteLinkDialog openState={{ openLinkDialog, setOpenLinkDialog }} />
        </>
    )
}