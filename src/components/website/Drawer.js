import { useState } from "react";
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from "@mui/system";
import { blueGrey } from "@mui/material/colors";
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    paper: {
        width: "100%",
        background: "#eeeeeeB3"
    },
    toolbar: theme.mixins.toolbar
}));
export default function DrawerComponent(data) {
    const classes = useStyles();
    const DrawerListItem = styled(ListItem)({
        textDecoration: "none",
        color: blueGrey[900],
        fontSize: "20px",
        "&:hover": {
            backgroundColor: "transparent",
            color: "black",
        },
    });
    const [openDrawer, setOpenDrawer] = useState(false);
    const menuItems = [
        {
            text: "Home",
            path: "/"
        },
        {
            text: "Collection",
            path: "/"
        },
        {
            text: "OpenSea",
            path: "/"
        },
        {
            text: "Whitelist",
            path: "/"
        },
        {
            text: "Whitepaper",
            path: data.data.projectInfo.whitepaper_link || "/"
        },
        {
            text: "Connect Wallet",
            path: "/"
        },
    ];
    return (
        <>
            <Drawer
                transitionDuration={{ enter: 500, exit: 1000 }}
                open={openDrawer}
                anchor="right"
                onClose={() => setOpenDrawer(false)}
                classes={{ paper: classes.paper }}
            >

                <List>
                    <div className={classes.toolbar} />
                    <div className={classes.toolbar} />
                    {menuItems.map((item) => (
                        <DrawerListItem
                            button
                            key={item.text}
                            onClick={() => { window.open(item.path, "_blank"); setOpenDrawer(!openDrawer); }}
                        >
                            <ListItemText primary={item.text} />
                        </DrawerListItem>
                    ))}
                </List>
            </Drawer>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
                {openDrawer ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
        </>
    );
}
