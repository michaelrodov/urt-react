/**
 * Created by Carlos on 12/08/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import ContentPage from './components.jsx';
import {createStore} from 'redux';
import {urtApp} from './reduxReducers';
import {initState} from './reduxActions';
import {xhttp} from 'xhttp';

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
    },
    (err, xhr) => {
        console.error(xhr.responseURL, xhr.status, xhr.statusText);
    });


