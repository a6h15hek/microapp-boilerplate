const fs = require('fs');
const os = require('os');
const path = require('path');
const originalConsole = {...console};

// Read package.json file and get the project name
const packageJson = require('@root/package.json');

// Fetch configurations from .env file
// LOG_DIR: The directory where log files will be stored
// LOG_DAYS: The number of days to keep log files
const LOG_DIR = process.env.LOG_DIR || path.join(os.homedir(), packageJson.name, 'logs');
const LOG_DAYS = process.env.LOG_DAYS || 5;

// Function to get log file path for the current date
const getLogFile = () => {
  const date = new Date();
  const fileName = packageJson.name + `_${date.getFullYear()}-${(('0' + (date.getMonth()+1)).slice(-2))}-${(('0' + date.getDate()).slice(-2))}.log`;
  return path.join(LOG_DIR, fileName);
};

// Check if log directory exists, and create it if it doesn't
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  console.log(`Created log directory: ${LOG_DIR}`);
}

function formatMessageWithColor(level) {
  const resetCode = '\x1b[0m';
  let colorCodes = '\x1b[37m'; // Default color is white

  switch (level) {
    case 'ERROR': colorCodes = '\x1b[31m'; break;
    case 'WARN': colorCodes = '\x1b[33m'; break;
    case 'INFO': colorCodes = '\x1b[34m'; break;
    case 'DEBUG': colorCodes = '\x1b[36m'; break;
    case 'LOG': colorCodes = '\x1b[32m'; break;
  }

  return `${colorCodes}${level}${resetCode}`;
}

// Enhance console methods to print messages with timestamp and store them in a log file
Object.keys(originalConsole).forEach(key => {
  console[key] = function (...args) {
    const date = new Date();
    const timestamp = `${date.getFullYear()}-${(('0' + (date.getMonth()+1)).slice(-2))}-${(('0' + date.getDate()).slice(-2))} ${(('0' + date.getHours()).slice(-2))}:${(('0' + date.getMinutes()).slice(-2))}:${(('0' + date.getSeconds()).slice(-2))}`;

    originalConsole[key].apply(console, [`${timestamp} ${formatMessageWithColor(key.toUpperCase())} -`, ...args]);
    fs.appendFileSync(getLogFile(), `${timestamp} ${key.toUpperCase()} - ${args.join(' ')}\n`);
  };
});

// Create a write stream to append logs to the file
const morganLogStream = {
  write: function (message) {
    //fs.appendFileSync(getLogFile(), message);
    console.info(message.replace(/\n(?=[^[\n]*$)/, ''));
  },
};

module.exports.morganLogStream = morganLogStream;

// Remove log files older than LOG_DAYS
// get a list of files in the directory
const files = fs.readdirSync(LOG_DIR).sort();

files.forEach(file => {
  const filePath = path.join(LOG_DIR, file);
  const stats = fs.statSync(filePath);

  // calculate the age of the file
  const fileAgeInDays = Math.round((Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24));
  if (fileAgeInDays > LOG_DAYS) { // if the file is older than LOG_DAYS, delete it
    fs.unlinkSync(filePath);
    console.info(`Removing log file older than ${LOG_DAYS} days: ${file}`);
  }
});

console.info(`Log directory: ${LOG_DIR}`);
console.info(`Keeping logs for the last ${LOG_DAYS} days`);