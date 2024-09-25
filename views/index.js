import React from 'react';
import ReactDOM from 'react-dom';
import '@views/index.css';
import { createTheme, THEME_ID, ThemeProvider } from '@mui/material/styles';
import { AuthenticationContextProvider } from '@views/AuthenticationContext';
import { GlobalStatusContextProvider } from '@views/GlobalStatusContext';
import HelloWorld from '@views/components/HelloWorld';

const materialTheme = createTheme({
  palette: {
    mode: 'dark',
    error: { main: '#e12b38' },
    warning: { main: '#fcc133' },
    info: { main: '#3778c2' },
    primary: { main: '#32064A' },
    secondary: { main: '#292930' }
  }
});

function MainApp() {
  return (
    <ThemeProvider theme={{ [THEME_ID]: materialTheme }} >
      <GlobalStatusContextProvider>
        <AuthenticationContextProvider>
          <HelloWorld/>
        </AuthenticationContextProvider>
      </GlobalStatusContextProvider>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
