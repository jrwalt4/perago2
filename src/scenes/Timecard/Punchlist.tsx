/**
 * Punchlist
 * Punchlist component that shows table of Punches by week, day, or other filter
 */

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { useGetPunchesQuery } from 'store/api';

const Punchlist: React.FunctionComponent = () => {
    const { data: punches, error } = useGetPunchesQuery();
    if(punches) {
        return (
            <List>
                {punches.map(p => <ListItem key={p.id}>{p.taskId}</ListItem>)}
                <ListItem>Add new punch</ListItem>
            </List>
        );
    }
    if(error) {
        return <b>Error</b>;
    }
    return <i>Loading...</i>
};

export default Punchlist;
