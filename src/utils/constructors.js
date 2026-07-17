export function calculateConstructorStandings(
  results,
  drivers,
  upToRace = null
) {

  const standings = {};

  const racesToInclude = upToRace
    ? results.filter(race => race.raceId <= upToRace)
    : results;


  racesToInclude.forEach(race => {

    race.results.forEach(result => {

      const driver = drivers.find(
        driver => driver.name === result.driver
      );

      if (!driver) return;


      if (!standings[driver.team]) {
        standings[driver.team] = 0;
      }


      standings[driver.team] += result.points;

    });

  });


  return Object.entries(standings)
    .map(([team, points]) => ({
      team,
      points
    }))
    .sort((a, b) => b.points - a.points);

}