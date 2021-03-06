/**
 * Created by Carlos on 28/07/2016.
 */
import * as Configs from './constants';
import * as Globals from './globals';

export function getRatio(player) {
    if ((player.deaths + player.kills) == 0) return 0;
    return Math.round((player.kills / (player.deaths + player.kills)) * 100) / 100;
}``

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
    if (!game || !game.players || !Object.keys(game.players)) {
        var nullGame = game;
        return 0;
    }
    var numberOfPlayers = Object.keys(game.players).length;
    var relative_kills = (game.gameTotalDeaths == 0 ? 0.01 : numberOfPlayers * player.kills / (2 * game.gameTotalDeaths));
    var relative_score = 1;
    if (player.score != 0) {
        relative_score = (game.gameTotalScore == 0 ? 0.01 : numberOfPlayers * player.score / (2 * game.gameTotalScore));
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
        sum += players[playerName].grade;
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
            if (teamIter % 2 == 0) { //assign to each team alternatively
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

    return teamBalance;
}

export function generatePowerPie(columns) {
    return c3.generate({
        bindto: '#power-pie-container',
        pie: {
            expand: true,
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
                red: '#424242',
                blue: '#a5c04d'
            },
            columns: columns,
            type: 'pie'
        }
    });
}

export function generateBarChart(columns) {
    return c3.generate({
        bindto: '#power-pie-container',
        pie: {
            expand: true,
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
                red: '#424242',
                blue: '#a5c04d'
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

export function orderByRatio(a, b) {
    return (a.ratio - b.ratio);
    // === 0) ? (a.name - b.name) : a.ratio - b.ratio;
}

export function orderByGrade(a, b) {
    // return (a.grade - b.grade === 0) ? (a.name - b.name) : a.grade - b.grade;
    return (a.grade - b.grade);
}


export function orderByNumber(a, b) {
    let keyArrayA = a.key.split(":");
    let keyArrayB = b.key.split(":");
    //keyarray[2] = sort desc order
    //true desc - false asc
    if (keyArrayA[2] === 'true') {
        return keyArrayA[1] - keyArrayB[1];
    } else {
        return keyArrayB[1] - keyArrayA[1];
    }
}

export function extractPlayersLineData(games) {
    var playersLineData = [];
    var columnsArry = [];
    var gameKeys = Object.keys(games);
    gameKeys.sort(function (a, b) {
        a = parseInt(a.substring(0, a.indexOf("_")));
        b = parseInt(b.substring(0, b.indexOf("_")));
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
    });
    for (var i = 0; i < gameKeys.length; i++) {
        var playerKeys = Object.keys(games[gameKeys[i]].players);
        for (var j = 0; j < playerKeys.length; j++) {
            if (!playersLineData[playerKeys[j]]) {
                playersLineData[playerKeys[j]] = [playerKeys[j]];
            }
            playersLineData[playerKeys[j]].push(
                getPlayersGradePerGame(
                    games[gameKeys[i]].players[playerKeys[j]], games[gameKeys[i]]));
        }
    }
    playerKeys = Object.keys(playersLineData);
    columnsArry.push(['xAxis'].concat(gameKeys));
    for (var i = 0; i < playerKeys.length; i++) {
        columnsArry.push(playersLineData[playerKeys[i]]);

    }

    return columnsArry;
}

export function calcPlayerGrade(data) {
    var dataV = data;
    var playerGrades = {};
    for (var i = 1; i < dataV.length; i++) {
        var playerData = dataV[i];
        var playerName = playerData[0];
        var weightSum = 0;
        var gradeSum = 0;
        var playerGrade;
        for (var j = 1; j < playerData.length; j++) {
            var weight = 0; //for all historical games no calc
            if (j < 3) {
                weight = 10;
            } else if (j < 6) {
                weight = 8;
            } else if (j < 12) {
                weight = 4;
            }
            weightSum += weight;
            gradeSum += weight * parseInt(playerData[j]);
        }
        if (weightSum > 0) {
            var tempGrade = gradeSum / weightSum;
            playerGrade = Math.round(tempGrade * 100) / 100;
        } else {
            playerGrade = 10;
        }
        playerGrades[playerName] = playerGrade;
    }
    return playerGrades;
}

export function extractPlayersLineDataRatio(games) {
    var playersLineData = [];
    var columnsArry = [];
    var gameKeys = Object.keys(games);
    gameKeys.sort(function (s1, s2) {
        let a = parseInt(s1.substring(0, s1.indexOf("_")));
        let b = parseInt(s2.substring(0, s2.indexOf("_")));
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
    });
    for (var i = 0; i < gameKeys.length; i++) {
        var playerKeys = Object.keys(games[gameKeys[i]].players);
        for (var j = 0; j < playerKeys.length; j++) {
            if (!playersLineData[playerKeys[j]]) {
                playersLineData[playerKeys[j]] = [playerKeys[j]];
            }
            playersLineData[playerKeys[j]].push(
                getRatio(
                    games[gameKeys[i]].players[playerKeys[j]]));
        }
    }
    playerKeys = Object.keys(playersLineData);
    columnsArry.push(['xAxis'].concat(gameKeys));
    for (var i = 0; i < playerKeys.length; i++) {
        columnsArry.push(playersLineData[playerKeys[i]]);

    }

    return columnsArry;
}

export function calcPlayerRatio(data) {
    var dataV = data;
    var playerRatios = {};
    for (var i = 1; i < dataV.length; i++) {
        var playerData = dataV[i];
        var playerName = playerData[0];
        var weightSum = 0;
        var ratioSum = 0;
        var playerRatio;
        for (var j = 1; j < playerData.length; j++) {
            var weight = 0; //for all historical games no calc
            if (j < 2) {
                weight = 10;
            } else if (j < 4) {
                weight = 8;
            } else if (j < 6) {
                weight = 4;
            }
            weightSum += weight;
            ratioSum += weight * parseFloat(playerData[j]);
        }
        if (weightSum > 0) {
            var tempRatio = ratioSum / weightSum;
            playerRatio = Math.round(tempRatio * 200) / 100;
        } else {
            playerRatio = 1;
        }
        playerRatios[playerName] = playerRatio;
    }
    return playerRatios;
}

/**
 * Get the value of a querystring
 * @param  {String} field The field to get the value of
 * @param  {String} url   The URL to get the value from (optional)
 * @return {String}       The field value
 */
export function getQueryString(field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};

export function buildTeams(columns, teams, players) {
    //build teams initial balance
    let teamBalanceObject = getTeamBalance(players);
    columns[Configs.RED] = [Configs.TEAM_COLORS[Configs.RED], teamBalanceObject.totals[Configs.RED]];
    columns[Configs.BLUE] = [Configs.TEAM_COLORS[Configs.BLUE], teamBalanceObject.totals[Configs.BLUE]];
    teams[Configs.RED] = teamBalanceObject.redTeamKeys;
    teams[Configs.BLUE] = teamBalanceObject.blueTeamKeys;
}

export function buildHistoryArrays(historyObjectsArray) {
    let scoreArray = (["score"]);
    let ratioArray = (["ratio"]);
    let gameNamesArray;

    if(historyObjectsArray){
        scoreArray = scoreArray.concat(historyObjectsArray.map(r => r.score));
        ratioArray = ratioArray.concat(historyObjectsArray.map(r => r.ratio));
        gameNamesArray = historyObjectsArray.map(r => r.name);
    }

    let result = [];
    result["x"] = gameNamesArray;

    if(scoreArray.length > 10) {
        scoreArray.splice(1, scoreArray.length-11);
    }

    result["grade"] = scoreArray;
    result["grade-desc"] = [Math.min(...scoreArray), Math.max(...scoreArray), scoreArray.length];

    if(ratioArray.length > 10){
        ratioArray.splice(1, ratioArray.length-11);
    }
    result["ratio"] = ratioArray;
    result["ratio-desc"] = [Math.min(...ratioArray), Math.max(...ratioArray), ratioArray.length];

    return result;

}