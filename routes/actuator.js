const express = require('express');
const fs = require('fs');

const router = express.Router();
const appStartTime = Date.now();

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const gitPropertiesRaw = fs.readFileSync('git.properties', 'utf8');
let gitProperties = gitPropertiesRaw.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  const parsedKey = key.replace('git.', '');
  acc[parsedKey] = value;
  return acc;
}, {});

router.get('/', (req, res) => {
  // previous content
  res.json({});
});

router.get('/health', (req, res) => {
  let healthJson = {
    status: 'UP'
  };
  res.json(healthJson);
});

router.get('/info', (req, res) => {
  let infoJson =
    {
      "git": gitProperties,
      "build": {
        "artifact": packageJson.name,
        "name": packageJson.name,
        "time": new Date(),
        "version": packageJson.version,
        "group": "com.jpmchase.abhishek.m.yadav.hello.ai",
      },
      // Add other properties
    };
  res.json(infoJson);
});

router.get('/metrics/application.started.time', (req, res) => {
  const appStartedTimeInSec = (Date.now() - appStartTime)/1000;
  const response = {
    "name": "application.started.time",
    "description": "Time taken to start the application",
    "baseUnit": "seconds",
    "measurements": [{"statistic": "Value", "value": appStartedTimeInSec}],
    "availableTags": [{"tag": "main.application.class", "values":["yadav.abhishek.helloai"]}]
  }
  res.json(response);
});

module.exports = router;
