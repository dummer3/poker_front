import { useEffect } from "react";
import { initializeApiClient, oauthSignIn } from "./ApiGoogle";
import { useNavigate } from "react-router-dom";
let fragmentString: string = window.location.hash.substring(1);

/**
 * function to launch the authentification
 * @returns {HTMLElement} - waiting page
 */
export const WaitForAuthentification = () => {
    oauthSignIn();
    return <h1>Authentification start</h1>
}

/**
 * function to receive the token and initialized the Google API
 * @returns {HTMLElement} - waiting page
 */
export const Callback = () => {

    useEffect(() => {
        const scriptAPI = document.createElement('script');

        scriptAPI.src = 'https://apis.google.com/js/api.js';
        scriptAPI.async = true;
        scriptAPI.defer = true;

        document.body.appendChild(scriptAPI);

        scriptAPI.addEventListener('load', () => {
            initializeApiClient(params['access_token']);
        });
    })

    let params = {};
    let regex: RegExp = /([^&=]+)=([^&]*)/g;
    let m: RegExpExecArray;
    const navigate = useNavigate();

    while ((m = regex.exec(fragmentString))) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (Object.keys(params).length > 0) {
        localStorage.setItem('oauth2-test-params', JSON.stringify(params));
    }

    setTimeout(() => { console.log(params); navigate("/home") }, 2000);
    return (<h1>Authentification ongoing</h1>);
}