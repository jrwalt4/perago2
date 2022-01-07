/**
 * Main Content in center of screen
 */

import Box from "@mui/material/Box";
import React from "react";
import { TitlebarSpacer } from "./Titlebar";

export default function MainContent({children}: React.PropsWithChildren<{}>) {
    return (
        <Box sx={{flexGrow: 1}}>
            <TitlebarSpacer />
            {children}
        </Box>
    );
}
