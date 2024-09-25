const express = require('express');

const router = express.Router();
const { setAuthenticationCookie, authenticationCheck, generateAuthToken, isClientCredentialValid, refreshAuthToken } = require('@services/authentication');


router.post('/login', (req, res) => {
  const { clientId, password } = req.body;

  if (!isClientCredentialValid(clientId, password)) {
    console.warn(`Invalid credentials provided for clientId: ${clientId}.`);
    return res.status(401).json({ message: 'Invalid credentials provided. Please ensure that the clientId and password are correct.' });
  }

  const token = generateAuthToken(clientId);
  if(token){
    setAuthenticationCookie(res, token);
    console.info(`Client: ${clientId} logged in successfully.`);
    res.status(200).json({ message: 'Login successful. Welcome!' });
  }else{
    console.error(`Failed to generate auth token for clientId: ${clientId}`);
    res.status(400).json({ message: 'Login failed. Unable to generate client token.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(process.env.AUTHENTICATION_COOKIE_KEY_NAME);
  console.info('User logged out successfully.');
  res.status(200).json({ message: 'Logout successful. See you next time!' });
});

router.post('/refresh-token', authenticationCheck , (req, res) => {
  const oldToken = req.cookies[process.env.AUTHENTICATION_COOKIE_KEY_NAME];
  if (!oldToken) {
    console.warn(`Refresh token failed. No existing token found.`);
    return res.status(401).json({ message: 'Refresh token failed. Please log in again.' });
  }
  const token = generateAuthToken(req.client.clientId);
  if(token){
    setAuthenticationCookie(res, token);
    console.info(`Token refreshed for client: ${req.client.clientId}`);
    res.status(200).json({ message: 'Token refreshed successfully.' });
  }else{
    console.error(`Failed to refresh token for client: ${req.client.clientId}`);
    res.status(400).json({ message: 'Token refresh failed. Please log in again.' });
  }
});

router.get('/is-authenticated', authenticationCheck , (req, res) => {
  res.status(200).json({
    message: 'Client is authenticated.',
    clientId: req.client.clientId
  });
});

module.exports = router;
