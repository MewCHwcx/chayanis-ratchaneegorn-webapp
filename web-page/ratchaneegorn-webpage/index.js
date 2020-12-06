const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { resolve } = require('path');
const { rejects } = require('assert');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize() {
    return new Promise((resolve, reject) => {
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            const { client_secret, client_id, redirect_uris } = JSON.parse(content).web;
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);

            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) return getAccessToken(oAuth2Client, callback);
                oAuth2Client.setCredentials(JSON.parse(token));
                resolve(oAuth2Client)
            })
        });
    })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
    return new Promise((resolve, reject) => {
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 30,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const events = res.data.items;
            resolve(events)
        });
    })
}

var event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2020-12-07T09:00:00+07:00',
      'timeZone': 'Asia/Bangkok'
    },
    'end': {
      'dateTime': '2020-12-07T10:00:00+07:00',
      'timeZone': 'Asia/Bangkok'
    },
    'attendees': [
      {'email': 's.ratchaneegron@kkumail.com'},
      {'email': 'wbm.chayanis@gmail.com'}
    ],
    'reminders': {
      'useDefault': false
    }
  };

function addEvent(auth, event) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.insert({
        auth,
        calendarId: 'primary',
        resource: event
    }, (err, res) => {
        console.log(err)
    })
}


// const http = require('http')
// const port = 5500
// const server = http.createServer((req, res) => {
//     res.statusCode = 200
//     // add to GET
//     authorize()
//     .then(oAuth2Client => {
//         listEvents(oAuth2Client)
//         .then(data => {
//             res.end(JSON.stringify(data))
//         })
//     }) 
// })
var express = require('express');
var app = express();
var things = require('./things.js')

app.use('/things', things);
app.use(express.static(__dirname + '/style'));
app.use(express.urlencoded({extended: false}))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/inform.html")
})
app.post("/addevent", (req, res) => {
    
    console.log(req.body)
    res.send("Data sent to backend")
})

app.listen(5500);