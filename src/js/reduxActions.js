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