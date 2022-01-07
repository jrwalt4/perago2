/**
 * Timecard component
 */
import Box from "@mui/material/Box";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem'
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';

import Sidebar from 'components/Sidebar';
import Titlebar from 'components/Titlebar';
import MainContent from 'components/MainContent'
import Punchlist from './Punchlist';

export default function Timecard() {
    return (
        <Box sx={{display: 'flex'}}>
            <Titlebar />
            <Sidebar><List><ListItem><ListItemText>This is a sidebar</ListItemText></ListItem></List></Sidebar>
            <MainContent>
                <Paper sx={{p:2}} elevation={0}>
                    <Typography variant="body1">Hello again</Typography>
                    <Punchlist />
                </Paper>
            </MainContent>
            <Sidebar anchor="right"><Typography variant="body2" sx={{p:2}}>These are details</Typography></Sidebar>
        </Box>
    );
}
