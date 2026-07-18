export const getCompletedSessions = (weekends) => {
  return weekends.flatMap(weekend =>
    weekend.sessions.filter(session => session.completed)
  );
};

export const getSessionsByType = (weekends, type) => {
  return weekends.flatMap(weekend =>
    weekend.sessions.filter(session => session.type === type)
  );
};

export const getWeekend = (weekends, raceId) => {
  return weekends.find(weekend => weekend.raceId === raceId);
};