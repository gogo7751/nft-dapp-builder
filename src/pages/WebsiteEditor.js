import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Tab, Box, Typography } from '@mui/material'

import ProjectInfo from '../components/editor/ProjectInfo'
import MintInfo from '../components/editor/MintInfo'
import AboutInfo from '../components/editor/AboutInfo'
import RoadmapInfo from '../components/editor/RoadmapInfo'
import TeamInfo from '../components/editor/TeamInfo'
import FaqInfo from '../components/editor/FaqInfo'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`editor-tabpanel-${index}`}
      aria-labelledby={`editor-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
            { children }
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `editor-tab-${index}`,
        'aria-controls': `editor-tabpanel-${index}`,
    };
}

export default function WebsiteEditor() {
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const tabItems = [
        {
            label: 'project',
            content: <ProjectInfo/>
        },
        {
            label: 'mint',
            content: <MintInfo/>
        },
        {
            label: 'about',
            content: <AboutInfo/>
        },
        {
            label: 'roadmap',
            content: <RoadmapInfo/>
        },
        {
            label: 'team',
            content: <TeamInfo/>
        },
        {
            label: 'faq',
            content: <FaqInfo/>
        },                
    ]  

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant='h4' sx={{marginLeft: 2, marginBottom: 2}}>
                Website
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    { tabItems.map((item, index) => (
                        <Tab label={item.label} key={index} {...a11yProps({index})} />
                    )) }
                </Tabs>
            </Box>

            { tabItems.map((item, index) => (
                <TabPanel value={value} index={index} key={index}>
                    {item.content}
                </TabPanel>                    
            ))}
        </Box>
    );
}