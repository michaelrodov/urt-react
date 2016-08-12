/**
 * Created by Carlos on 28/07/2016.
 */
//TODO do in ecma6 way

function getRatio(player) {
    return Math.round((player.kills / (player.deaths + player.kills)) * 100) / 100;
}

function getGameGrade(player,game) {
    var relative_kills = (game.gameTotalDeaths == 0 ? 0.01 : (Object.keys(game.players).length * player.kills / (2 * game.gameTotalDeaths)));
    var relative_score = 1;
    if (player.score != 0) {
        relative_score = (game.gameTotalScore == 0 ? 0.01 : (Object.keys(game.players).length * player.score / (2 * game.gameTotalScore)));
    } else {
        relative_score = relative_kills;
    }
    var totalGrade = Math.round((relative_kills + relative_score + getRatio(player)) * 3000) / 100;
    return totalGrade ;
}

/***
 * Final function
 * @param player
 * @returns {number}
 */
function getGrade(player, totalKills) {
    if(!totalKills){
        //var totalKills = currentGame.gameTotalDeaths; //deaths = kills in total per game :)
        return getGameGrade(player,currentGame);
    }
    for (var i = 0; i < playersTotalGrades.length; i++) {
        if (playersTotalGrades[i].name == player) {
            return playersTotalGrades[i].grade;
        }
    }
    return 999999;
}

function addToTeam(player) {
    currentGame.columns[(player.team == TEAM_COLORS[BLUE]) ? BLUE : RED][1] += getGrade(player);
    //TODO make a better managing of
}

function compareTeams() {
    return currentGame.columns[BLUE][1] - currentGame.columns[RED][1];
}

function removeFromTeam(player) {
    currentGame.columns[(player.team == TEAM_COLORS[BLUE]) ? BLUE : RED][1] -= getGrade(player);
}

/***
 * The function runs after the value was already changed.
 * Therefore we will add to current team and will substruct from teh other team
 * @param name
 */
function playerToggleTeam(name, oneway) {
    var player = currentGame.players[name];

    console.info(player.name + " onChange with: " + player.team);
    /*Since this function is called after the change was made, the team relation should be opposite from the logic
     * i.e. new team = toTeam, old team = fromTeam*/
    var toTeam = ((player.team == TEAM_COLORS[BLUE]) ? BLUE : RED);
    var fromTeam = Math.abs(toTeam - 1);
    var rating = getGrade(player);


    if (!oneway) {  //only for moving beween teams
        currentGame.columns[fromTeam][1] -= rating;
        currentGame.columns[toTeam][1] += rating;
    } else {
        if (player.include) { //only for include / exclude in teams count
            currentGame.columns[toTeam][1] += rating;
        }
        else {
            currentGame.columns[toTeam][1] -= rating;
        }
    }
    refreshPowerPie(currentGame.columns);
}

function getGame(gameId) {
    if (typeof gameId == 'number') {
        return games[gameKeys[gameId]];
    } else if (typeof gameId == 'string') {
        return games[gameId];
    }
}

function getLineFillStyle(value) {
    return {background: "linear-gradient(to right, lavender 0%,lavender " + Math.round((value/currentGame.maxGrade)*100) + "%,white " + Math.round((value/currentGame.maxGrade)*100) + "%,white 100%)"};
}

function setCurrentGame(storage, key) {
    storage["currentGame"] = getGame(key);
    storage.setColumns([[TEAM_COLORS[BLUE], 0], [TEAM_COLORS[RED], 0]]); //init teams
    storage["playersKeys"] = Object.keys(currentGame.players);
    storage["playersArray"] = convertToArray(currentGame.players,key)
    storage.currentGame["maxGrade"] = storage.playersArray[0].grade; //TODO do it in more general way
    initIncluded(storage.currentGame);
    buildTeams(storage.currentGame);

    powerPie = generatePowerPie(storage.currentGame.columns);

}

function initIncluded(game) {
    var players = Object.keys(game.players);
    var gameMaxScore = 0;
    for (var i = 0; i < players.length; i++) {
        (typeof game.players[players[i]].include !== 'boolean') ? game.players[players[i]].include = (EXCLUDED_PLAYERS.indexOf(game.players[players[i]].name)<0)?true:false : '';
    }
}

//init
function buildTeams(game) {
    currentGame.columns = [[TEAM_COLORS[BLUE], 0], [TEAM_COLORS[RED], 0]]; //init teams
    for (var i = 0; i < playersArray.length; i++) {
        var player = game.players[playersArray[i].name];
        if (player.include) {
            if (compareTeams() >= 0) { //blue bigger
                player.team = TEAM_COLORS[RED];
            } else {
                player.team = TEAM_COLORS[BLUE];
            }
            addToTeam(player);
        }
    }
    refreshPowerPie(currentGame.columns);
}

function calcPlayerGrade(data) {
    var dataV = data;
    var playerGrades = [];
    for (var i = 1; i < dataV.length; i++) {
        var playerData = dataV[i];
        var playerName = playerData[0];
        var weightSum = 0;
        var gradeSum = 0;
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
        var player = {};
        player.name = playerName;
        if (weightSum > 0) {
            var tempGrade = gradeSum / weightSum;
            player.grade = Math.round(tempGrade*100)/100;
        } else {
            player.grade = 10;
        }
        playerGrades.push(player);
    }
    return playerGrades;
}

function fillSummaryGrade(games, playerGrades) {
    var players = games["SUMMARY"].players;
    for (var i = 0; i < Object.keys(players).length; i++) {
        var playerName = Object.keys(players)[i];
        players[playerName].grade = getGrade(playerName,-1);
    }
}
