import React, { createContext, useContext, useEffect, useState } from 'react';
import { SERVER_URL } from '@views/util';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import { useGlobalStatus } from '@views/GlobalStatusContext';

const AuthenticationContext = createContext({});

export const AuthenticationContextProvider = ({ children }) => {
  const { fetchAuthenticationStatus, ...authObject } = useAuthenticationService();

  useEffect(() => {
    fetchAuthenticationStatus();
  }, []);

  return (
    <AuthenticationContext.Provider value={authObject}>
      <LoginFormDialog/>
      {children}
    </AuthenticationContext.Provider>
  );
};

const useAuthenticationService = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentClientId, setCurrentClientId] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const globalStatus = useGlobalStatus();

  const fetchAuthenticationStatus = async() => {
    try {
      setIsWaiting(true);
      console.log('Fetching auth status metadata...');
      const response = await fetch(SERVER_URL + '/auth/is-authenticated', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setIsAuthenticated(response.status === 200);
      if(response.status === 200) {
        const response_json = await response.json();
        setCurrentClientId(response_json?.clientId);
        globalStatus.showSnackbar('success', response_json.message);
      }
    } catch (error) {
      console.error('Failed to fetch auth status:', error);
      globalStatus.showSnackbar('error', 'Failed to fetch authentication status.');
    } finally {
      setIsWaiting(false);
    }
  };

  const login = async({ clientId, password }) => {
    try {
      setIsWaiting(true);
      const response = await fetch(SERVER_URL + '/auth/login', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          password
        }),
      });

      const response_json = await response.json();
      if(response.status === 200) {
        setIsAuthenticated(true);
        setCurrentClientId(clientId);
        globalStatus.showSnackbar('success', response_json.message);
      }else{
        globalStatus.showSnackbar('error', response_json.message);
      }
    } catch (error) {
      console.error('Failed to send feedback:', error);
      globalStatus.showSnackbar('error', 'Login Failed.');
    } finally {
      setIsWaiting(false);
    }
  };

  const logout = async() => {
    try {
      setIsWaiting(true);
      const response = await fetch(SERVER_URL + '/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if(response.status === 200) {
        setIsAuthenticated(false);
        setCurrentClientId('');
        globalStatus.showSnackbar('success', 'Logout successful.');
      }else{
        const response_json = await response.json();
        globalStatus.showSnackbar('error',  response_json.message);
      }
    } catch (error) {
      console.error('Failed to logout:', error);
      globalStatus.showSnackbar('error', 'Logout Failed.');
    } finally {
      setIsWaiting(false);
    }
  };

  const refreshToken = async() => {
    try {
      setIsWaiting(true);
      const response = await fetch(SERVER_URL + '/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const response_json = await response.json();
      if(response.status === 200) {
        setIsAuthenticated(true);
        globalStatus.showSnackbar('success', response_json.message);
      }else{
        globalStatus.showSnackbar('error', response_json.message);
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      globalStatus.showSnackbar('error', 'Token refresh failed.');
    }finally {
      setIsWaiting(false);
    }
  };

  return { fetchAuthenticationStatus, isAuthenticated, login, refreshToken, logout, clientId: currentClientId, isWaiting };
};

export const useAuthentication = () => useContext(AuthenticationContext);

const LoginFormDialog = () => {
  const client = useAuthentication();

  return (
    <Dialog
      open={!client.isAuthenticated}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          client.login(formJson);
        },
      }}
    >
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Log In
        </DialogContentText>
        <TextField autoFocus required margin="dense" id="emailId" name="clientId" label="username" type="text"
          fullWidth
          variant="standard"
        />
        <TextField required margin="dense" id="password" name="password" label="Password" type="password"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          variant={'contained'}
          disabled={client.isWaiting}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};
