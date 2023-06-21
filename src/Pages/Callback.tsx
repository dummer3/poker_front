import { useEffect } from "react";
import { initializeApiClient, oauthSignIn } from "./ApiGoogle";
import { useNavigate } from "react-router-dom";
var fragmentString: string = window.location.hash.substring(1);

export const WaitForAuthentification = () => {
    oauthSignIn();
    return <h1>Authentification start</h1>
}

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
        //localStorage.setItem('oauth2-test-params', JSON.stringify(params));
        if (params['state'] && params['state'] === 'pass-through value') {
            console.log(params['access_token']);
        }
    }

    setTimeout(() => { navigate("/home") }, 1000);
    return (<h1>Authentification ongoing</h1>);
}