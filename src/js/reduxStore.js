import {createStore} from 'redux';
import urtApp from './reduxReducers';
import * as Configs from './constants';
import * as functions from './functions';
 

let store = createStore(urtApp);


export function buildInitialObject(data) {
    var appStore = {};
    appStore["currentGame"] = {
        name: "SUMMARY",
        totalDeaths: data.games.SUMMARY.gameTotalDeaths,
        totalKills: data.games.SUMMARY.gameTotalKills,
        players: []
    };
    appStore["gameKeys"] = Object.keys(data.games);
    appStore["games"] = data.games;
    appStore["columns"] = ([[Configs.TEAM_COLORS[Configs.BLUE], 0], [Configs.TEAM_COLORS[Configs.RED], 0]]); //init teams

    return appStore;
}
