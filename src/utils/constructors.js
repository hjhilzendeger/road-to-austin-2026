export function calculateConstructorStandings(
  weekends,
  drivers,
  upToRace = null
) {

  const standings = {};

  // Create a lookup table for drivers
  const driverLookup = {};

  drivers.forEach(driver => {
    driverLookup[driver.name] = driver;
  });

  const weekendsToInclude = upToRace
    ? weekends.filter(weekend => weekend.raceId <= upToRace)
    : weekends;

  weekendsToInclude.forEach(weekend => {

    weekend.sessions.forEach(session => {

      if (!session.completed) return;

      session.results.forEach(result => {

        const driver = driverLookup[result.driver];

        if (!driver) return;

        if (!standings[driver.team]) {
          standings[driver.team] = 0;
        }

        standings[driver.team] += result.points;

      });

    });

  });

  return Object.entries(standings)
    .map(([team, points]) => ({
      team,
      points
    }))
    .sort((a, b) => b.points - a.points);

}