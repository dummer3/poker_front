import { Question_t, Quizz_t } from '../types/types';

declare var gapi: any

const SCOPES = 'https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/spreadsheets';

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

export const getScenarios = ({ positions, situations }): Promise<String[]> => {
    return gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'getScenarios',
            "parameters": [
                positions, situations
            ],
        },
    }).then(ManageError).then((questions: Question_t[]) => { return questions });
}


export const GetQuestions = async (quizz: Quizz_t): Promise<Question_t[]> => {

    return gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'getQuestions',
            "parameters": [
                quizz.scenarios, quizz.difficulty, quizz.nbrQuestion
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
            'function': 'getQuizz'
        }
    }).then(ManageError).then((value: Quizz_t[]) => { return value });
}

export function oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': process.env.REACT_APP_CLIENT_ID,
        'redirect_uri': 'http://127.0.0.1:3000/callback',
        'response_type': 'token',
        'scope': SCOPES,
        //'include_granted_scopes': 'true',
        'state': 'pass-through value'
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

export function initializeApiClient(token: string) {
    gapi.load('client', () => {
        gapi.client
            .init({
                apiKey: process.env.REACT_APP_API_KEY,
                discoveryDocs: ['https://script.googleapis.com/$discovery/rest?version=v1'],
            })
            .then(() => {
                gapi.auth.setToken({
                    access_token: token,
                });
            });
    });
}
