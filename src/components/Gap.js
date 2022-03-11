import React from 'react'
import { Box } from '@mui/material'

export default function Gap({width, height}) {    
    const sx = { height: 10 }
    if(width) sx["width"] = width
    if(height) sx["height"] = height

    return (
        <Box sx={sx}></Box>
    )
}

