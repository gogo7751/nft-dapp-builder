import React, { useState, useEffect, useContext, useRef } from 'react'
import { Container, Box, Divider, Button, Typography } from '@mui/material'
import { UserContext } from '../../UserContex'
import { Label } from '../Label'
import ProjectDataService from '../../services/ProjectDataService'
import Panel from '../Panel'
import TextInput from '../TextInput'
import Switch from '../Switch'
import ItemList from '../List'
import ItemDialog from '../ItemDialog'
import AddIcon from '@mui/icons-material/Add'

export default function RoadmapInfo() {
    const { project, setProject } = useContext(UserContext)
    const [items, setItems] = useState([])
    const [item, setItem] = useState(null)
    const [openItemDialog, setOpenItemDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [actionLabel, setActionLabel] = useState("")
    const initProjectData = useRef(false)
    const initItemData = useRef(false)

    useEffect(()=> {
        // load items from project data at first time
        if(initProjectData.current === false) {
            initProjectData.current = true
            console.log("initProjectData...")

            try {
                const data = project["roadmap_section"]
                const currentItems = data["items"]
                setItems(currentItems === undefined ? [] : currentItems)
                //console.log("currentItems", currentItems)
            }
            catch (error) {
                setItems([])
            }    
        }
        else {
            // ignore items update at first time (prevent project data sync)
            if(initItemData.current === false) {
                initItemData.current = true
                console.log("initItemData...")
            }
            else {
                // sync project data
                console.log("save roadmap items", items)
                const data = project["roadmap_section"]
                const newProjectData = { ...project, "roadmap_section": { ...data, "items": items }}
                setProject(newProjectData)
                ProjectDataService.updateProjectData(newProjectData)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items])

    const handleItemAction = (newItem) => {
        var index = items.indexOf(item)
        const newItems = [...items]

        if (index !== -1) {
            newItems[index] = newItem
        }
        else {
            newItems.push(newItem)
        }

        setItems(newItems)
    }

    const handleItemDelete = (item) => {
        const newItems = items.filter( el => el.id !== item.id ); 
        setItems(newItems)
    }

    const handleItemEdit = (item) => {
        setItem(item)
        setActionLabel("Update")
        setDialogTitle("Edit item")
        setOpenItemDialog(true)
    }

    const handleItemChangeOrder = (newItems) => {
        setItems(newItems)
    }

    const handleBtnAdd = () => {
        setItem({})
        setActionLabel("Add")
        setDialogTitle("Add new item")
        setOpenItemDialog(true)
    }

    return (
        <Container maxWidth="md">
            
            <Panel>
            {/* bgcolor="primary.main" */}
                <Box display="flex" justifyContent="space-between" >
                    <Label gutterBottom>
                        Roadmap Section
                    </Label>

                    <Switch
                        label="Show section" 
                        field="roadmap_section"
                        subField = "display"
                    />
                </Box>

                {/* Title */}
                <TextInput 
                    label="Title" 
                    placeholder="Enter title"
                    field="roadmap_section"
                    subField = "title"
                    gutterBottom
                />                

                {/* Sub-Title */}
                <TextInput 
                    label="Subtitle" 
                    placeholder="Enter subtitle"
                    field="roadmap_section"
                    subField = "subtitle"
                    gutterBottom
                />

                <Divider/>

                {/* Roadmap items */}
                <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    sx={{paddingLeft: 2, paddingTop: 3, paddingRight: 3}}
                >
                    <Typography style={{ fontWeight: 800 }}>
                        Roadmap Items
                    </Typography>

                    <Button 
                        onClick={handleBtnAdd} 
                        endIcon={<AddIcon/>}
                    >
                        Add Item
                    </Button>
                </Box>

                <ItemList 
                    items={items} 
                    handleItemDelete={handleItemDelete}
                    handleItemEdit={handleItemEdit}
                    handleItemChangeOrder={handleItemChangeOrder}
                />
            </Panel>

            {/* Add Item Dialog */}
            <ItemDialog 
                item={item}
                title={dialogTitle}
                primaryLabel="Item title"
                secondaryLabel="Item description"
                actionLabel={actionLabel}
                openItemDialog={openItemDialog}
                setOpenItemDialog={setOpenItemDialog}
                handleAction={handleItemAction}
            />
        </Container>
  )
}