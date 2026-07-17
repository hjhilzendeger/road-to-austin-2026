export function calculateStandings(results) {

  const standings = {};

  results.forEach(race => {

    race.results.forEach(result => {

      if (!standings[result.driver]) {
        standings[result.driver] = 0;
      }

      standings[result.driver] += result.points;

    });

  });


  return Object.entries(standings)
    .map(([driver, points]) => ({
      driver,
      points
    }))
    .sort((a, b) => b.points - a.points);

}