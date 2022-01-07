import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiToolbar: {
            defaultProps: {
                variant: "dense"
            }
        }
    }
});

export default theme;
