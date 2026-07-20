const medal = position => {
  if (position === '1') return '🥇'
  if (position === '2') return '🥈'
  if (position === '3') return '🥉'
  return `${position}.`
}

export function renderConstructorStandingsList(standings) {
  if (!standings.length) {
    return '<p class="data-message">Standings are not available yet.</p>'
  }

  return standings.map(entry => `
    <div class="standing-row">
      <span class="standing-position">${medal(entry.position)}</span>
      <div class="standing-identity">
        <strong>${entry.Constructor?.name ?? ''}</strong>
        <small>${entry.wins} win${entry.wins === '1' ? '' : 's'}</small>
      </div>
      <span>${entry.points} pts</span>
    </div>
  `).join('')
}

export function ConstructorStandings(standings) {
  return `
    <article class="card standings-card">
      <div class="card-heading">
        <div>
          <span class="eyebrow">Live championship</span>
          <h2>🏢 Constructors</h2>
        </div>
      </div>

      <div id="constructor-list" class="standings-list">
        ${renderConstructorStandingsList(standings)}
      </div>
    </article>
  `
}
