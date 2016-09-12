import * as actionTypes from './reduxActionTypes';
import * as Configs from './constants';
import * as functions from './functions';


const initialState = {
    summary: {
        name: "SUMMARY",
        totalDeaths: 0,
        totalKills: 0,
        totalGrade: 0,
        totalScore: 0,
        playersCount: 0,
        date: null,
    },
    players: [],
    gameKeys: [],
    gameKeysExpanded: false,
    games: [],
    columns: [],
    teams: [],
    nonActivePlayers: Configs.EXCLUDED_PLAYERS,
    activeGame: Configs.SUMMARY_GAME,
    summaryOrderField: "grade",
    summaryOrderDesc: true,
    gameOrderField: "score",
    gameOrderDesc: true
}


/***
 *
 * @param state - defaults to initial state
 * @param actio
 */
export function urtApp(state = initialState, action) {
    if (action.type === actionTypes.INIT_STATE) {
        let summaryGame = action.data.games[Configs.SUMMARY_GAME];
        state.summary.name = summaryGame.gameId;
        state.summary.totalDeaths = summaryGame.gameTotalDeaths;
        state.summary.totalScore = summaryGame.gameTotalScore;
        state.summary.date = summaryGame.gameDate;
        state.summary.totalGrade = functions.getTeamGrade(summaryGame.players, summaryGame);
        state.summary.totalKills = functions.getTeamKills(summaryGame.players);
        state.summary.playersCount = Object.keys(summaryGame.players).length;
        state.activeGame = Configs.SUMMARY_GAME;
        state.summaryOrderField = "grade";
        state.summaryOrderDesc = false;
        state.gameOrderField = "score";
        state.gameOrderDesc = true;
        
        //calcuation summary grade and ratio per player by other games grade.
        //grade
        var playersColumnsOverGames = functions.extractPlayersLineData(action.data.games);
        var playersTotalGrades = functions.calcPlayerGrade(playersColumnsOverGames);
        //ratio
        var playersColumnsOverGames = functions.extractPlayersLineDataRatio(action.data.games);
        var playersTotalRatios = functions.calcPlayerRatio(playersColumnsOverGames);

        
        //transform the crud players list to form stored in the redux store
        for (let playerName of Object.keys(summaryGame.players)) {
            let player = summaryGame.players[playerName];
            state.players[player.name] = Object.assign({}, player);
            state.players[player.name].ratio = playersTotalRatios[player.name];
            state.players[player.name].grade = playersTotalGrades[player.name];
            //Set players that are excluded from calculations
            state.players[player.name]["active"] = (!Configs.EXCLUDED_PLAYERS.includes(player.name));
        }

        //build teams initial balance
        let teamBalanceObject = functions.getTeamBalance(state.players);
        state.columns[Configs.RED] = [Configs.TEAM_COLORS[Configs.RED], teamBalanceObject.totals[Configs.RED]];
        state.columns[Configs.BLUE] = [Configs.TEAM_COLORS[Configs.BLUE], teamBalanceObject.totals[Configs.BLUE]];
        state.teams[Configs.RED] = teamBalanceObject.redTeamKeys;
        state.teams[Configs.BLUE] = teamBalanceObject.blueTeamKeys;

        //build a list of games from games array nad fix their names
        state.gameKeys = Object.keys(action.data.games)
            .sort(function (a, b) {
                if (a === "SUMMARY") {
                    return -1 * Number.MAX_SAFE_INTEGER;
                } else if (b === "SUMMARY") {
                    return Number.MAX_SAFE_INTEGER;
                } else {
                    return parseInt((b.split("_"))[0]) - parseInt((a.split("_"))[0]);
                }
            })
            .splice(0, Configs.GAME_LIST_MIN);

        for (let key of state.gameKeys) {
            if (key != Configs.SUMMARY_GAME) {
                state.games[key] = {};
                state.games[key] = Object.assign({}, action.data.games[key]);
            }
        }


        return state;

    } else if (action.type === actionTypes.SET_GRADE) {
        var newState = Object.assign({}, state);
        newState.players[name].grade = action.grade;
        return newState;

    } else if (action.type === actionTypes.SET_GAME) {
        var newState = Object.assign({}, state);
        newState.activeGame = action.key;
        return newState;

    } else if (action.type === actionTypes.ORDERBY_GAME) {
        var newState = Object.assign({}, state);
        newState.gameOrderField = action.column;
        newState.gameOrderDesc = !action.desc;
        return newState;

    } else if (action.type === actionTypes.ORDERBY_SUMMARY) {
        var newState = Object.assign({}, state);
        newState.summaryOrderField = action.column;
        newState.summaryOrderDesc = !action.desc;
        return newState;

    } else if (action.type === actionTypes.EXCLUDE_PLAYER) {
        var newState = Object.assign({}, state);
        newState.players[action.playerName].active = false;
        return newState;

    } else if (action.type === actionTypes.BUILD_TEAMS) {
        let teamBalanceObject = functions.getTeamBalance(state.players);

        var newState = Object.assign({}, state);

        newState.columns[Configs.RED] = [Configs.TEAM_COLORS[Configs.RED], teamBalanceObject.totals[Configs.RED]];
        newState.columns[Configs.BLUE] = [Configs.TEAM_COLORS[Configs.BLUE], teamBalanceObject.totals[Configs.BLUE]];
        newState.teams[Configs.RED] = teamBalanceObject.redTeamKeys;
        newState.teams[Configs.BLUE] = teamBalanceObject.blueTeamKeys;


        return newState;


    } else if (action.type === actionTypes.INCLUDE_PLAYER) {
        var newState = Object.assign({}, state);
        newState.players[action.playerName].active = true;
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
