import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { store } from './store';

import theme from './theme';

import Timecard from './scenes/Timecard';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Timecard />
      </ThemeProvider>
    </Provider>
  );
}
