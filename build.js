// Build script for Vercel — fills in the Firebase config placeholders
// from environment variables at deploy time, then writes the final,
// ready-to-serve file into the "public" folder.
//
// This uses only Node's built-in modules, so no "npm install" is needed.

const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, 'source.html'), 'utf8');

const replacements = {
  '__FIREBASE_API_KEY__': process.env.FIREBASE_API_KEY || '',
  '__FIREBASE_AUTH_DOMAIN__': process.env.FIREBASE_AUTH_DOMAIN || '',
  '__FIREBASE_PROJECT_ID__': process.env.FIREBASE_PROJECT_ID || '',
  '__FIREBASE_STORAGE_BUCKET__': process.env.FIREBASE_STORAGE_BUCKET || '',
  '__FIREBASE_MESSAGING_SENDER_ID__': process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  '__FIREBASE_APP_ID__': process.env.FIREBASE_APP_ID || '',
  '__FIREBASE_MEASUREMENT_ID__': process.env.FIREBASE_MEASUREMENT_ID || '',
  '__FIREBASE_APPCHECK_SITE_KEY__': process.env.FIREBASE_APPCHECK_SITE_KEY || 'null',
};

let missing = [];
for(const [placeholder, value] of Object.entries(replacements)){
  if(!value) missing.push(placeholder.replace(/_/g,' ').trim());
}
if(missing.length){
  console.warn('WARNING: missing environment variables for:', missing.join(', '));
  console.warn('Set these in Vercel Project Settings → Environment Variables.');
}

let output = source;
for(const [placeholder, value] of Object.entries(replacements)){
  output = output.split(placeholder).join(value);
}

fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), output);

console.log('Build complete: public/index.html generated.');
