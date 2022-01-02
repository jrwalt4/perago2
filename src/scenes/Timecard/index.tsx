/**
 * Timecard component
 */
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useGetPunchesQuery } from 'store/api';

const Punchlist: React.FunctionComponent = () => {
    const { data: punches, error } = useGetPunchesQuery();
    if(punches) {
        return (
            <List>
                {punches.map(p => <ListItem key={p.id}>{p.taskId}</ListItem>)}
            </List>
        );
    }
    if(error) {
        return <b>Error</b>;
    }
    return <i>Loading...</i>
};

export default function Timecard() {
    return (
        <>
            <Typography variant="h1">Hello!</Typography>
            <Punchlist />
        </>
    );
}
