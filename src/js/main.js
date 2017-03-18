/**
 * Created by Rodov on 12/08/2016.
 */
import Browser from 'detect-browser';
import React from 'react';
import ReactDOM from 'react-dom';
import ContentPage from './ContentPage.jsx';
import {createStore} from 'redux';
import {urtApp} from './ReduxReducers';
import {initState} from './ReduxActions';
import AOS from 'aos';
import * as Constants from './constants';
import * as functions from './functions';
import ga from "./GoogleAnalytics";


/*Allow access only for Chrome/Opera/FireFox*/
if (Browser.name.search(Constants.NOT_SUPPORTED_BROWSERS) > -1) {
    console.info("browser: " + Browser.name);
    location.href = "../../not-supported.html?browser=" + ((Browser.name == 'ie') ? "InternetExplorer" : Browser.name);
}

/*Animate On Scroll library init*/
AOS.init();
ga.init();

//fetch the games data
let headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

let init = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
};

let json = functions.getQueryString("json", window.location.href);
let requestGames = new Request("DATA/" + json, init);
ga.tenant = "hpe";

if (json == "innovid_games.json") {
    ga.tenant = "innovid";
    document.getElementById("clan-title").innerHTML = "Urban Terror<br>Innovid Clan";
}

fetch(requestGames)
    .then((response) => {
        if (response.status != 200) {
            console.error("Response code expected is 200, but received was " + response.status);
            return;
        }

        response.json().then(data => {
                console.log("Data loaded. Loaded " + Object.keys(data.games).length + " games.");


                let reduxStore = createStore(urtApp);
                reduxStore.dispatch(initState(data));

                ReactDOM.render(
                    <ContentPage store={reduxStore}/>,
                    document.getElementById('react-container')
                );

                //slowly fadein the actual body of the screen
                document.getElementById("main").className += ' fadein';
                document.getElementById("loader").className += ' fadeout';

            }
        );


    })
    .catch(err => {
        console.error("Failed to fetch games.json. " + err.status + ":" + err.statusText);
    });



