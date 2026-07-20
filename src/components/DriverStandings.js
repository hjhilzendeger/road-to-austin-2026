const medal = position => {
  if (position === '1') return '🥇'
  if (position === '2') return '🥈'
  if (position === '3') return '🥉'
  return `${position}.`
}

const driverName = entry => `${entry.Driver?.givenName ?? ''} ${entry.Driver?.familyName ?? ''}`.trim()

export function renderDriverStandingsList(standings) {
  if (!standings.length) {
    return '<p class="data-message">Standings are not available yet.</p>'
  }

  return standings.map(entry => `
    <div class="standing-row">
      <span class="standing-position">${medal(entry.position)}</span>
      <div class="standing-identity">
        <strong>${driverName(entry)}</strong>
        <small>${entry.Constructors?.[0]?.name ?? ''}</small>
      </div>
      <span>${entry.points} pts</span>
    </div>
  `).join('')
}

export function DriverStandings(standings, races, selectedRound) {
  const completedRaces = races.filter(race => Number(race.round) <= Number(selectedRound))

  return `
    <article class="card standings-card">
      <div class="card-heading">
        <div>
          <span class="eyebrow">Live championship</span>
          <h2>🏆 Drivers</h2>
        </div>

        <label class="round-control" for="race-selector">
          <span>Through round</span>
          <select id="race-selector">
            ${completedRaces.map(race => `
              <option value="${race.round}" ${String(race.round) === String(selectedRound) ? 'selected' : ''}>
                ${race.round}: ${race.raceName}
              </option>
            `).join('')}
          </select>
        </label>
      </div>

      <div id="standings-list" class="standings-list">
        ${renderDriverStandingsList(standings)}
      </div>
    </article>
  `
}
