import { useEffect } from 'react';
import { Question_t, Quizz_t } from '../types/type';

declare var google: any
declare var gapi: any

const DISCOVERY_DOC = 'https://script.googleapis.com/$discovery/rest?version=v1';
const SCOPES = 'https://www.googleapis.com/auth/script.projects';

let tokenClient;

// Init the oAuth connection with our poker project
const gapiLoaded = async () => {
    gapi.load('client', initializeGapiClient);
}

const initializeGapiClient = async () => {
    await gapi.client.init({
        apiKey: process.env.REACT_APP_API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
}

// Create the token to allow call 
const gisLoaded = () => {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
}

// If everything is load, we can continue
export function FinishLoad() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }

    console.log("finish load");
}

const ManageError = (response) => {
    const result = response.result;
    if (result.error && result.error.status) {
        console.log('Error calling API:' + result.error.status);
    } else if (result.error) {
        const error = result.error.details[0];
        console.log('Script error message: ' + error.errorMessage);
        if (error.scriptStackTraceElements) {
            // There may not be a stacktrace if the script didn't start executing.
            console.log('Script error stacktrace:');
            for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
                const trace = error.scriptStackTraceElements[i];
                console.log('\t' + trace.function + ':' + trace.lineNumber);
            }
        }

    }
    return result.response.result;
}

export const getScenarios = ({ position, situation }): Promise<String[]> => {
    return gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'getScenarios',
            "parameters": [
                position, situation
            ],
        },
    }).then(ManageError).then((questions: Question_t[]) => { return questions });
}


export const GetQuestions = async (): Promise<Question_t[]> => {

    return gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'getQuestions',
            "parameters": [
                "5B", "BB vs BTN", 3, 50
            ],
        },
    }).then(ManageError).then((questions: Question_t[]) => { return questions });
}

export const saveQuizz = (quizz: Question_t): Promise<void> => {
    console.log(quizz);
    return gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'newQuizz',
            "parameters": quizz
        }
    }).then(ManageError);
}

export const getQuizz = (): Promise<Quizz_t[]> => {
    return gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'getQuizz',
        }
    }).then(ManageError).then((value: Quizz_t[]) => { return value });
}

export const Api = async () => {
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
            gisLoaded();
        });
    }, []);
}
