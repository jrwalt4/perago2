/**
 * Header/Titlebar used by each scene that needs navigation capabilities
 * (which should be all)
 */

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";

export const TitlebarSpacer = Toolbar;

export default function Titlebar() {
    return (
        <AppBar position="fixed" elevation={1} sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
            <Toolbar>
                <IconButton color="inherit"><MenuIcon /></IconButton>
                <Typography variant="h6">Perago</Typography>
            </Toolbar>
        </AppBar>
    )
}
