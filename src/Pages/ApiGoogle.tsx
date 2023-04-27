import { useEffect } from 'react';;

declare var google: any
declare var gapi: any


const DISCOVERY_DOC = 'https://script.googleapis.com/$discovery/rest?version=v1';
const SCOPES = 'https://www.googleapis.com/auth/script.projects';

let tokenClient;
let gapiInited = false;
let gisInited = false;


const gapiLoaded = async () => {
    gapi.load('client', initializeGapiClient);
}

const initializeGapiClient = async () => {
    await gapi.client.init({
        apiKey: process.env.REACT_APP_API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();

}

const gisLoaded = () => {
    console.log(process.env.REACT_APP_CLIENT_ID);
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            await listMajors();
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

const listMajors = () => {

    console.log(gapi);
    gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'getQuizz',
            "parameters": [
                "5B", "BB vs BTN", 3, 50
            ],
        },
    }).then((resp) => {
        console.log(resp);
        const result = resp.result;
        if (result.error && result.error.status) {
            console.log('Error calling API:' + result.error.status);
        } else if (result.error) {
            const error = result.error.details[0];
            console.log('Script error message: ' + error.errorMessage);
            if (error.scriptStackTraceElements) {
                // There may not be a stacktrace if the script didn't start
                // executing.
                console.log('Script error stacktrace:');
                for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
                    const trace = error.scriptStackTraceElements[i];
                    console.log('\t' + trace.function + ':' + trace.lineNumber);
                }
            }
        } else {
            const quizz = result.response.result;
            console.log(quizz)
        }
    });
}

export const Api = () => {
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
