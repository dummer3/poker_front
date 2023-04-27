// Exemple if we fetch data directly to the Sheet

import { useEffect } from 'react';

declare var google: any
declare var gapi: any

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
let tokenClient;

let gapiInited = false;
let gisInited = false;


const gapiLoaded = async () => {
    gapi.load('client', initializeGapiClient);
}

const initializeGapiClient = async () => {
    await gapi.client.init({
        apiKey: process.env.API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    allLoad();

}

const gisLoaded = () => {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: process.env.CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    allLoad();
}

function allLoad() {
    if (gapiInited && gisInited) {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            await test();
        };

        if (gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient.requestAccessToken({ prompt: '' });
        }
    }
}

const test = () => {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: 'Ranges for Quiz!G4:I172',
    }).then((response) => {
        const range = response.result;
        if (!range || !range.values || range.values.length === 0) {
            console.log('No values found.');
            return;
        }
        console.log(range);
        console.log(range.values);
        // Flatten to string to display
        const output = range.values.reduce(
            (str, row) => `${str}${row[0]}, ${row[1]}, ${row[2]}\n`,
            'Name, Major:\n');
        console.log(output);
    }
    )


}

const Sheet = () => {

    useEffect(() => {
        const scriptAPI = document.createElement('script');
        scriptAPI.src = 'https://apis.google.com/js/api.js';
        scriptAPI.async = true;
        scriptAPI.defer = true;

        const scriptAccount = document.createElement('script');
        scriptAccount.src = 'https://accounts.google.com/gsi/client';
        scriptAccount.async = true;
        scriptAccount.defer = true;

        document.body.appendChild(scriptAPI);
        document.body.appendChild(scriptAccount);

        scriptAPI.addEventListener('load', () => {
            gapiLoaded();
        });


        scriptAccount.addEventListener('load', () => {
            console.log("loadGIS")
            gisLoaded();
        });
    }, []);


    return (<>
    </>);
}

export default Sheet;