/**
 * Created by Carlos on 12/08/2016.
 */
import Browser from 'detect-browser';
import React from 'react';
import ReactDOM from 'react-dom';
import ContentPage from './ContentPage.jsx';
import {createStore} from 'redux';
import {urtApp} from './ReduxReducers';
import {initState} from './ReduxActions';
import {xhttp} from 'xhttp';
import AOS from 'aos';
import * as Constants from './constants';

/*Allow access only for Chrome/Opera/FireFox*/
if (Browser.name.search(Constants.NOT_SUPPORTED_BROWSERS) > -1) {
    console.info("browser: "+Browser.name);
    location.href = "../../not-supported.html?browser=" + ((Browser.name == 'ie') ? "InternetExplorer" : Browser.name);
}

/*Animate On Scroll library init*/
AOS.init();

xhttp({
    url: "DATA/games.json",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    method: 'GET'},
    (data, xhr) => {
        console.log("Data loaded. Loaded " + Object.keys(data.games).length + " games.");


        let reduxStore = createStore(urtApp);
        reduxStore.dispatch(initState(data));

        ReactDOM.render(
            <ContentPage store={reduxStore}/>,
            document.getElementById('react-container')
        );

        //slowly fadein the actual body of the screen
        document.getElementById("main").className += ' fadein';
    },
    (err, xhr) => {
        console.error(xhr.responseURL, xhr.status, xhr.statusText);
    });


