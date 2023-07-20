import { Question_t, Quiz_t } from '../types/types';

declare let gapi: any

const SCOPES = 'https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/script.external_request openid profile';

const ManageError = (response) => {
    try {
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
    catch
    {
        console.log("erreur lors de l'appel API, veuillez attendre")
    }

}
/**
 * Function to get all available scenarios from positions and scenarios defined
 * @param {{positions:string, situations:string}} info - information needed to select a scenario
 * @returns {Promise<String[]>} - list of all available scenario
 */
export const getScenarios = (info: { positions: string[], situations: string[] }): Promise<String[]> => {
    return gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'getScenarios',
            "parameters": [
                info.positions, info.situations
            ],
        },
    }).then(ManageError).then((questions: Question_t[]) => { return questions });
}

/**
 * Function to get the questions of the quiz given as a parameter
 * @param {Quiz_t} quiz - quiz we want to play 
 * @returns {Promise<Question_t[]>} - list of all available scenarios
 */
export const GetQuestions = async (quiz: Quiz_t): Promise<Question_t[]> => {
    return gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'getQuestions',
            "parameters": [
                quiz.scenarios, quiz.difficultyMin, quiz.difficultyMax, quiz.nbrQuestion
            ],
        },
    }).then(ManageError).then((questions: Question_t[]) => { return questions });
}

/**
 * Function to save a quiz
 * @param {Quiz_t} quiz - quiz we want to save
 * @returns {Promise<void>} - nothing useful
 */
export const saveQuiz = (quiz: Question_t): Promise<void> => {
    return gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'newQuiz',
            "parameters": [quiz, JSON.parse(localStorage.getItem('oauth2-test-params'))["access_token"]]
        }
    }).then(ManageError);
}

/**
 * Function to get all the quiz save 
 * @returns {Promise<Quiz_t[]>} - list of all the quiz save
 */
export const getQuiz = (): Promise<Quiz_t[]> => {
    return gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'getQuiz',
            'parameters': [
                JSON.parse(localStorage.getItem('oauth2-test-params'))["access_token"]
            ]
        }
    }).then(ManageError).then((value: Quiz_t[]) => { return value });
}

/**
 * Function to get a part of the range chart for a specific scenario.
 * @param {string} hand - hand of the hero for this question
 * @param {string} scenario - scenraio for this question 
 * @returns {Promise<string[][]>} - array that represent a local part of the range chart
 */
export const GetExplanation = async (hand: string, scenario: string): Promise<string[][]> => {

    return gapi.client.script.scripts.run({
        'scriptId': process.env.REACT_APP_API_ID,
        'resource': {
            'function': 'getExplanation',
            "parameters": [
                hand, scenario
            ],
        },
    }).then(ManageError).then((chart: string[][]) => { return chart });
}


/**
 * Function to let the user connect to his google account and give a token
 */
export function oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    let oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    let form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    let params = {
        'client_id': process.env.REACT_APP_CLIENT_ID,
        'redirect_uri': window.location.href + "callback",
        'response_type': 'token',
        'scope': SCOPES,
        'include_granted_scopes': 'true',
        'state': 'pass-through value'
    };

    // Add form parameters as hidden input values.
    for (let p in params) {
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

/**
 * Function to initialize the connection with the google API with the user token
 * @param {string} token - the token of the user
 */

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
