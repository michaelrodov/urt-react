/**
 * Created by Carlos on 28/07/2016.
 */
import * as Configs from './constants';
import * as Globals from './globals';

export function getRatio(player) {
    return Math.round((player.kills / (player.deaths + player.kills)) * 100) / 100;
}

/***
 * Final function
 * @param player
 * @returns {number}
 */
export function getGrade(player, totalKills) {
    if (!totalKills) {
        return getPlayersGradePerGame(player, currentGame);
    }
}

export function getPlayersGradePerGame(player, game) {
    var relative_kills = (game.totalDeaths == 0 ? 0.01 : game.playersCount * player.kills / (2 * game.totalDeaths));
    var relative_score = 1;
    if (player.score != 0) {
        relative_score = (game.totalScore == 0 ? 0.01 : game.playersCount * player.score / (2 * game.totalScore));
    } else {
        relative_score = relative_kills;
    }
    var totalGrade = Math.round((relative_kills + relative_score + getRatio(player)) * 3000) / 100;
    return totalGrade;
}

export function getTeamKills(players) {
    var sum = 0;
    for (const playerName of Object.keys(players)) {
        sum += players[playerName].kills;
    }
    return sum;
}

export function getTeamGrade(players, game) {
    var sum = 0;
    for (let playerName of Object.keys(players)) {
        sum += (game) ? getPlayersGradePerGame(players[playerName], game) : players[playerName].score;
    }
    return sum;
}

function getKeys(players) {
    let keys = [];
    for (const player of players) {
        keys.push(player.name);
    }
    return keys;
}

export function getTeamBalance(players) {
    let teamBalance = [];
    teamBalance["totals"] = [0, 0]; //init teams
    teamBalance["redTeamKeys"] = [];
    teamBalance["blueTeamKeys"] = [];


    var teamBlue = [];
    var teamRed = [];
    var teamIter = 0;


    for (const playerName of Object.keys(players)) {
        let player = players[playerName];
        if (player.active) {
            if (teamIter % 2 == 0) { //assign to each team alternatley
                teamBlue.push(player);
            } else {
                teamRed.push(player);
            }
            teamIter++;
        }
    }

    var iter = Configs.BALANCE_ITERATIONS;
    //run for max 1000 iterations and try different player sets until minimum diff is reached
    while (iter > 0 && Math.abs(getTeamGrade(teamRed) - getTeamGrade(teamBlue)) > 5) {

        //randomly select 2 players to switch
        var bluePlayerIndx = Math.floor(Math.random(teamBlue.length) * teamBlue.length);
        var redPlayerIndx = Math.floor(Math.random(teamRed.length) * teamRed.length);
        //remove players from both teams
        var bluePlayer = teamBlue.splice(bluePlayerIndx, 1)[0];
        var redPlayer = teamRed.splice(redPlayerIndx, 1)[0];
        //swap the players
        teamBlue.push(redPlayer);
        teamRed.push(bluePlayer);

        iter--;
    }


    teamBalance.totals[Configs.RED] = getTeamGrade(teamRed);
    teamBalance.totals[Configs.BLUE] = getTeamGrade(teamBlue);
    teamBalance.blueTeamKeys = getKeys(teamBlue);
    teamBalance.redTeamKeys = getKeys(teamRed);

    /*    var copyText = "";
     copyText += "Blue team Achziv:\n";
     for (var j = 0; j < teamBlue.length; j++) {
     copyText += "* " + teamBlue[j].name + "\n";
     }
     copyText += "\n";
     copyText += "Red team Yechiam:\n";
     for (var j = 0; j < teamRed.length; j++) {
     copyText += "* " + teamRed[j].name + "\n";
     }
     $scope.copyText = copyText;*/

    return teamBalance;
}

export function generatePowerPie(columns) {
    return c3.generate({
        bindto: '#power-pie-container',
        pie: {
            label: {
                format: function (value, ratio, id) {
                    return d3.round(value, 1);
                }
            }
        },
        size: {
            width: 200,
            height: 200
        },
        data: {
            colors: {
                red: '#F44336',
                blue: '#3891A6'
            },
            columns: columns,
            type: 'pie'
        }
    });
}

export function refreshPowerPie(columns) {
    if (Globals.powerPie) {
        Globals.powerPie.load({columns: columns});
    }
}

export function orderByNumber(a, b) {
    let keyArrayA = a.key.split(":");
    let keyArrayB = b.key.split(":");
    //keyarray[2] = sort desc order
    //true desc - false asc
    if (keyArrayA[2]==='true') {
        return keyArrayA[1] - keyArrayB[1];
    } else {
        return keyArrayB[1] - keyArrayA[1];
    }
}