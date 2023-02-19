(() => {
  'use strict';

  const trade = {};
  let teamOneTotal = 0;
  let teamTwoTotal = 0;
  let teamOnePlayers = [];
  let teamTwoPlayers = [];
  let players;
  fetch('players.json?d=20210606')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      players = data;
      trade.populateDataList(players);
      trade.findPlayer = function (playerName) {
        const player = players.find((element) => element.name === playerName);
        if (player !== undefined) {
          return player.value;
        }
        return 0;
      };

      const teamOneDataList = document.getElementById('teamOneInput');
      teamOneDataList.addEventListener('change', (event) => {
        const pName = event.target.value;
        trade.updateTeamOne(pName);
        trade.finalizeSelection(event);
      });

      trade.generateTeamOneText = function (player, playerValue) {
        return '<span class="deleteTeamOne" id="' + player + '">' + player + ' - ' + playerValue + ' ' + trade.trashIcon + '</span>';
      };

      trade.updateTeamOne = function (player) {
        const playerValue = trade.findPlayer(player);
        const teamOne = document.getElementById('teamOnePlayers');
        teamOne.innerHTML += trade.generateTeamOneText(player, playerValue);
        trade.addOnClickTeamOne();

        trade.updateTeamOneTotal(playerValue);
        const container = document.getElementById('teamOneTotal');
        container.innerHTML = teamOneTotal;
        teamOnePlayers.push(player);
        trade.displayWinner();
      };

      trade.updateTeamOneTotal = function (playerValue) {
        teamOneTotal += playerValue;
        const container = document.getElementById('teamOneTotal');
        container.innerHTML = teamOneTotal;
      };

      trade.addOnClickTeamOne = function () {
        document.querySelectorAll('.deleteTeamOne').forEach((btn) => {
          btn.addEventListener('click', function (event) {
            trade.deleteTeamOnePlayer(event);
          });
        });
      };

      trade.deleteTeamOnePlayer = function (event) {
        let playerName = event.path[1].id;
        document.getElementById(playerName).remove();
        const playerValue = trade.findPlayer(playerName);
        trade.updateTeamOneTotal(-playerValue);
        const val = teamOnePlayers.indexOf(playerName);
        if (val > -1) {
          teamOnePlayers.splice(val, 1);
        }
        trade.finalizeSelection(event);
      };

      const teamOneList = trade.getURLParam('teamOne');
      if (teamOneList !== null) {
        const teamOneArray = teamOneList.split(',');
        for (let player in teamOneArray) {
          trade.updateTeamOne(teamOneArray[player]);
        }
      }

      const teamTwoDataList = document.getElementById('teamTwoInput');
      teamTwoDataList.addEventListener('change', (event) => {
        const pName = event.target.value;
        trade.updateTeamTwo(pName);
        trade.finalizeSelection(event);
      });

      trade.generateTeamTwoText = function (player, playerValue) {
        return '<span class="deleteTeamTwo" id="' + player + '">' + player + ' - ' + playerValue + ' ' + trade.trashIcon + '</span>';
      };

      trade.updateTeamTwo = function (player) {
        const playerValue = trade.findPlayer(player);
        const teamTwo = document.getElementById('teamTwoPlayers');
        teamTwo.innerHTML += trade.generateTeamTwoText(player, playerValue);
        trade.addOnClickTeamTwo();

        trade.updateTeamTwoTotal(playerValue);
        const container = document.getElementById('teamTwoTotal');
        container.innerHTML = teamTwoTotal;
        teamTwoPlayers.push(player);
        trade.displayWinner();
      };

      trade.updateTeamTwoTotal = function (playerValue) {
        teamTwoTotal += playerValue;
        const container = document.getElementById('teamTwoTotal');
        container.innerHTML = teamTwoTotal;
      };

      trade.addOnClickTeamTwo = function () {
        document.querySelectorAll('.deleteTeamTwo').forEach((btn) => {
          btn.addEventListener('click', function (event) {
            trade.deleteTeamTwoPlayer(event);
          });
        });
      };

      trade.deleteTeamTwoPlayer = function (event) {
        let playerName = event.path[1].id;
        document.getElementById(playerName).remove();
        const playerValue = trade.findPlayer(playerName);
        trade.updateTeamTwoTotal(-playerValue);
        const val = teamTwoPlayers.indexOf(playerName);
        if (val > -1) {
          teamTwoPlayers.splice(val, 1);
        }
        trade.finalizeSelection(event);
      };

      const teamTwoList = trade.getURLParam('teamTwo');
      if (teamTwoList !== null) {
        const teamTwoArray = teamTwoList.split(',');
        for (let player in teamTwoArray) {
          trade.updateTeamTwo(teamTwoArray[player]);
        }
      }
    });

  trade.trashIcon =
    '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAANlBMVEX////Jycl5eXktLS0eHh4AAADm5ua9vb2Li4saGhoXFxf8/PzLy8uUlJRtbW1sbGz19fX09PSmmdx/AAAAY0lEQVQY02WPSQ6AMAwDJ1tpy1L4/2dRobfMIVIiObaZiLbemwqLEVVKkRrj391YmANcxrYBc9oFEnDEA3ccEIJW4DSwE6hKEwBX/fTS6AVgd98BSk+HJElPk20KlqKncqn+C7oSAz/2Ib19AAAAAElFTkSuQmCC" alt="delete">';

  trade.populateDataList = function (players) {
    const teamOneList = document.getElementById('teamOne');
    players.forEach((item) => {
      let option = document.createElement('option');
      option.value = item.name;
      teamOneList.appendChild(option);
    });
    const teamTwoList = document.getElementById('teamTwo');
    players.forEach((item) => {
      let option = document.createElement('option');
      option.value = item.name;
      teamTwoList.appendChild(option);
    });
  };

  trade.displayWinner = function () {
    const winner = document.getElementById('winner');
    if ((teamOneTotal - teamTwoTotal) / teamOneTotal > 0.05) {
      winner.innerHTML = 'Team One wins this trade!';
    } else if ((teamTwoTotal - teamOneTotal) / teamTwoTotal > 0.05) {
      winner.innerHTML = 'Team Two wins this trade!';
    } else {
      winner.innerHTML = 'This is a fair trade!';
    }
  };

  trade.finalizeSelection = function (event) {
    trade.displayWinner();
    event.target.value = '';
    let url = location.origin + '?teamOne=' + teamOnePlayers.join(',') + '&teamTwo=' + teamTwoPlayers.join(',');
    let urlSpan = document.getElementById('url');
    urlSpan.innerHTML = '<a href="' + url + '">' + url + '</a>';
  };

  trade.getURLParam = function (param) {
    const url = new URL(location.href);
    const searchParams = new URLSearchParams(url.search);
    return searchParams.get(param);
  };

  const reset = document.getElementById('reset');
  reset.addEventListener('click', (event) => {
    document.getElementById('teamOnePlayers').innerHTML = '';
    document.getElementById('teamTwoPlayers').innerHTML = '';
    document.getElementById('teamOneTotal').innerHTML = '';
    document.getElementById('teamTwoTotal').innerHTML = '';
    teamOneTotal = 0;
    teamTwoTotal = 0;
    teamOnePlayers = [];
    teamTwoPlayers = [];
    document.getElementById('winner').innerHTML = 'Please choose players for each team.';
  });
})();
