import {actions} from './reduxActions';
import * as actionTypes from './reduxActionTypes';
import * as Configs from './constants';
import * as functions from './functions';


const initialState = {
    currentGame: {
        name: "SUMMARY",
        totalDeaths: 0,
        totalKills: 0,
        totalGrade: 0,
        date: null,
    },
    players: [],
    gameKeys: [],
    games: [],
    columns: []
}



/***
 *
 * @param state - defaults to initial state
 * @param action
 */
export function urtApp(state = initialState, action) {
    if (action.type === actionTypes.INIT_STATE) {
        let summaryGame = action.data.games[Configs.SUMMARY_GAME];
        state.currentGame.name = summaryGame.gameId;
        state.currentGame.totalDeaths = summaryGame.gameTotalDeaths;
        state.currentGame.totalKills = summaryGame.gameTotalScore;
        state.currentGame.date = summaryGame.gameDate;

        for (let player of Object.keys(summaryGame.players)) {
            state.players[player] = Object.assign({}, summaryGame.players[player]);
            state.players[player].ratio = functions.getRatio(summaryGame.players[player]);
            state.players[player].grade = functions.getGrade(summaryGame.players[player], summaryGame.totalKills);

        }

        state.gameKeys = Object.keys(action.data.games).sort(function (a, b) {
            if (a === "SUMMARY") {
                return -1 * Number.MAX_SAFE_INTEGER;
            } else if (b === "SUMMARY") {
                return Number.MAX_SAFE_INTEGER;
            } else {
                return parseInt((b.split("_"))[0]) - parseInt((a.split("_"))[0]);
            }
        });

        return state;
    } else if (action.type === actionTypes.SET_GRADE) {
        var newState = Object.assign({}, state);
        newState.players[name].grade = action.grade;
        return newState;
    } else if (action.type === actionTypes.SET_TEAM) {
        var newState = Object.assign({}, state);
        for (let name of action.names) {
            newState.players[name].team = action.team;
        }
        return newState;
    } else {
        return state;
    }
}
