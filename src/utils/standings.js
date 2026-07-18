export function calculateStandings(weekends, upToRace = null) {

  const standings = {};

  const weekendsToInclude = upToRace
    ? weekends.filter(weekend => weekend.raceId <= upToRace)
    : weekends;

  weekendsToInclude.forEach(weekend => {

    weekend.sessions.forEach(session => {

      if (!session.completed) return;

      session.results.forEach(result => {

        if (!standings[result.driver]) {
          standings[result.driver] = 0;
        }

        standings[result.driver] += result.points;

      });

    });

  });

  return Object.entries(standings)
    .map(([driver, points]) => ({
      driver,
      points
    }))
    .sort((a, b) => b.points - a.points);

}