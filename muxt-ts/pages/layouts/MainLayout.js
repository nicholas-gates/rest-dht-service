import React, { useState } from "react";

import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Container,

} from "@mui/material";
import Stack from "@mui/joy/Stack";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListIcon from "@mui/icons-material/List";

const MainLayout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Container>
            <Drawer open={isOpen} onClose={toggleDrawer}>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText>Dashboard</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ListIcon />
                        </ListItemIcon>
                        <ListItemText>Data Table</ListItemText>
                    </ListItem>
                </List>
            </Drawer>
            <Stack spacing={8}>
                <AppBar>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography>DHT Readings</Typography>
                    </Toolbar>
                </AppBar>
                <Container>
                    {children}
                </Container>
            </Stack>
        </Container>
    );
};

export default MainLayout;
