(() => {
    'use strict';

    let count = 0;
    const positions = ['QB', 'RB', 'WR', 'TE', 'DEF', 'K']
    fetch('https://api.sleeper.app/v1/players/nfl')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        for (const player in data) {
          const currentPlayer = data[player];
          const playerPositions = currentPlayer.fantasy_positions || [];
          if (currentPlayer.active && positions.some( r => playerPositions.indexOf(r) >= 0) && currentPlayer.team) {
            count++;
            console.log(currentPlayer);
            console.log({ id: currentPlayer.player_id, name: currentPlayer.full_name });
          }
        }
        console.log(count);
      });
  })();
