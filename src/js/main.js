/**
 * Created by Carlos on 12/08/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import ContentPage from './components.jsx';



var loadData = function () {
    $.ajax({
        url: "DATA/games.json",
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            console.log("Data loaded. Data: " + data);

            /*Master Render*/
            var gameKeysArray = Object.keys(data.games).sort(function (a, b) {
                if (a === "SUMMARY") {
                    return -1 * Number.MAX_SAFE_INTEGER;
                } else if (b === "SUMMARY") {
                    return Number.MAX_SAFE_INTEGER;
                } else {
                    return parseInt((b.split("_"))[0]) - parseInt((a.split("_"))[0]);
                }
            });

            setCurrentGame('SUMMARY');
            storage.init(data.games);

            ReactDOM.render(<ContentPage games={data.games} gameKeys=""/>,
                document.getElementById('react-container'));


        }.bind(this),
        error: function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
};
loadData();
