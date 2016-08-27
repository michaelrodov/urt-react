/**
 * Created by Carlos on 12/08/2016.
 */
import * as actionTypes from './reduxActionTypes';
import * as functions from './functions';

export function initState(summary) {
    return {
        type: actionTypes.INIT_STATE,
        data: summary
    }
}
export function setGrade(name, grade) {
    return {
        type: actionTypes.SET_GRADE,
        name: name,
        grade: grade
    }
}
export function setTeam(names, team) {
    return {
        type: actionTypes.SET_TEAM,
        names: names,
        team: team
    }
}
export function includePlayer(playerName) {
    return {
        type: actionTypes.INCLUDE_PLAYER,
        playerName: playerName
    }
}
export function excludePlayer(playerName) {
    return {
        type: actionTypes.EXCLUDE_PLAYER,
        playerName: playerName
    }
}
export function updateTeams(teamBalance) {
    let columns = [];
    columns.push(teamBalance.totals[0]);
    columns.push(teamBalance.totals[1]);
    let teamsArray = [];
    teamsArray.push(teamBalance.blueTeamKeys);
    teamsArray.push(teamBalance.redTeamKeys);

    return {
        type: actionTypes.BUILD_TEAMS,
        columns: columns,
        teams: teamsArray
    }
}
