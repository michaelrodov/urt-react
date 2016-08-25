/**
 * Created by Carlos on 12/08/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import ContentPage from './components.jsx';
import {createStore} from 'redux';
import {urtApp} from './reduxReducers';
import {initState} from './reduxActions';


var loadData = function () {
    $.ajax({
        url: "DATA/games.json",
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            console.log("Data loaded. Loaded " + Object.keys(data.games).length + " games.");
            /*
             * You may optionally specify the initial state as the second argument to createStore().
             * This is useful for hydrating the state of the client to match the state of a Redux application running on the server.
             * let store = createStore(todoApp, window.STATE_FROM_SERVER)*/
            let reduxStore = createStore(urtApp);
            reduxStore.dispatch(initState(data));

            ReactDOM.render(
                <ContentPage store={reduxStore}/>,
                document.getElementById('react-container')
            );


        }.bind(this),
        error: function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
};

loadData();
