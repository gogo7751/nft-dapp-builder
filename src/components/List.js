import React from 'react'
import { Box, List, ListItem, ListItemText, ListItemIcon, IconButton, ListItemSecondaryAction, ListItemAvatar, Avatar } from '@mui/material'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import EditIcon from '@mui/icons-material/Edit'

const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,
    ...(isDragging && {
        background: "rgb(245,245,245)"
    })
})

const getListStyle = isDraggingOver => ({
    //background: isDraggingOver ? 'lightblue' : 'lightgrey',
})

export default function ItemList({items, handleItemDelete, handleItemEdit, handleItemChangeOrder}) {
    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return
        }

        // re-order items
        const startIndex = result.source.index
        const endIndex = result.destination.index
        const newItems = Array.from(items);
        const [removed] = newItems.splice(startIndex, 1);
        newItems.splice(endIndex, 0, removed);

        handleItemChangeOrder(newItems)
    }

    return (
        <Box sx={{marginTop:-1, marginRight: -4}}>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                <Box ref={provided.innerRef}>
                    <List style={getListStyle(snapshot.isDraggingOver)}>
                        {items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                <ListItem
                                    ContainerComponent="li"
                                    ContainerProps={{ ref: provided.innerRef }}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}
                                >
                                    <ListItemIcon>
                                        <DragIndicatorIcon fontSize="small"/>
                                    </ListItemIcon>

                                    {
                                        (item.image && 
                                            <ListItemAvatar>
                                                <Avatar src={item?.image}/>
                                            </ListItemAvatar>)
                                    }

                                    <ListItemText
                                        primary={item.primary}
                                        secondary={item.secondary}
                                    />

                                    <IconButton onClick={() => handleItemEdit(item)}>
                                        <EditIcon fontSize="small"/>
                                    </IconButton>

                                    <IconButton onClick={() => handleItemDelete(item)}>
                                        <DeleteIcon fontSize="small"/>
                                    </IconButton>

                                    <ListItemSecondaryAction/>
                                </ListItem>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </List>
                </Box>
            )}
            </Droppable>
        </DragDropContext>
        </Box>
    )
}
