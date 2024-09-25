const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const clientDatabase = {
  root: {role: 'system', clientId: 'root', password: 'root'}
};

function generateAuthToken(clientId) {
  if(clientId && clientDatabase[clientId]){
    const client = clientDatabase[clientId];
    console.info(`Generating auth token for clientId: ${clientId}`);
    return jwt.sign({ role: client.role, clientId: client.clientId }, JWT_SECRET, {
      expiresIn: eval(process.env.AUTHENTICATION_ACCESS_TOKEN_TIME)
    });
  }
  console.error(`Failed to generate auth token for clientId: ${clientId}`);
  return false;
}

function isClientCredentialValid(clientId, password) {
  if(clientId && password){
    const client = clientDatabase[clientId];
    if(client && client.password === password){
      console.info(`Client credentials for clientId: ${clientId} are valid.`);
      return true;
    }
  }
  console.warn(`Client credentials for clientId: ${clientId} are invalid.`);
  return false;
}

function setAuthenticationCookie(res, token){
  res.cookie(process.env.AUTHENTICATION_COOKIE_KEY_NAME, token, {
    expires: new Date(Date.now() + eval(process.env.AUTHENTICATION_ACCESS_TOKEN_TIME) * 1000),
    httpOnly: process.env.AUTHENTICATION_COOKIE_HTTP_ONLY === 'true',
    secure: process.env.AUTHENTICATION_COOKIE_SECURE.toLowerCase() === 'true',
    sameSite:  process.env.AUTHENTICATION_COOKIE_SAME_SITE.toLowerCase() in ['true', 'false'] ?
      process.env.AUTHENTICATION_COOKIE_SAME_SITE.toLowerCase() === 'true' : process.env.AUTHENTICATION_COOKIE_SAME_SITE
  });
}

function authenticationCheck(req, res, next) {
  const token = req.cookies[process.env.AUTHENTICATION_COOKIE_KEY_NAME];
  if (!token) {
    console.warn(`Authentication failed. No access token found.`);
    return res.status(401).json({ message: 'Authentication failed. No access token found.' });
  }
  jwt.verify(token, JWT_SECRET, function(err, decoded) {
    if (err) {
      console.error("Error verifying auth token.", err);
      return res.status(403).json({ message: 'Forbidden: Authentication Failed.' });
    }
    const client = clientDatabase[decoded.clientId];
    if (!client || client.role !== decoded.role) {
      console.warn(`Client not found for clientId: ${decoded.clientId}`);
      return res.status(404).json({ message: 'Client not found' });
    }
    req.client = client;

    // Check whether the token is going to expire within the next AUTHENTICATION_ACCESS_TOKEN_REFRESH_TIME.
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decoded.exp - currentTime <= eval(process.env.AUTHENTICATION_ACCESS_TOKEN_REFRESH_TIME)) {
      const newToken = generateAuthToken(decoded.clientId);
      setAuthenticationCookie(res, newToken);
      console.log(`Token for clientId: ${decoded.clientId} has been refreshed.`);
    }

    next();
  });
}

module.exports = { authenticationCheck, generateAuthToken, isClientCredentialValid, setAuthenticationCookie }
