/**
 * Created by Carlos on 12/08/2016.
 */
const SET_GRADE = "SET_GRADE";
const SET_TEAM = "SET_TEAM";
function setGrade(name, grade){
    return {
        type: SET_GRADE,
        name: name,
        grade: grade
    }
}

function setTeam(name, team){
    return {
        type: SET_TEAM,
        name: name,
        team: team
    }
}