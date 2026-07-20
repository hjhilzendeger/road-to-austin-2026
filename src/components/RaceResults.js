const sessionLabel = type => ({
  qualifying: '⏱ Qualifying',
  sprint: '⚡ Sprint',
  race: '🏁 Grand Prix'
}[type] ?? type)

const positionLabel = position => {
  const numeric = Number(position)
  if (numeric === 1) return '🥇'
  if (numeric === 2) return '🥈'
  if (numeric === 3) return '🥉'
  return `${position}.`
}

const driverName = result =>
  `${result.Driver?.givenName ?? ''} ${result.Driver?.familyName ?? ''}`.trim()

const formatStatus = result => {
  if (result.Time?.time) return result.Time.time
  if (result.status) return result.status
  return '—'
}

const formatQualifyingTime = result => result.Q3 || result.Q2 || result.Q1 || '—'

const renderRaceRows = results => results.map(result => `
  <div class="result-row result-row-detailed">
    <span class="result-position">${positionLabel(result.position)}</span>
    <div class="result-driver">
      <strong>${driverName(result)}</strong>
      <small>${result.Constructor?.name ?? ''}</small>
    </div>
    <span class="result-time">${formatStatus(result)}</span>
    <strong class="result-points">${result.points} pts</strong>
  </div>
`).join('')

const renderQualifyingRows = results => results.map(result => `
  <div class="result-row result-row-detailed">
    <span class="result-position">${positionLabel(result.position)}</span>
    <div class="result-driver">
      <strong>${driverName(result)}</strong>
      <small>${result.Constructor?.name ?? ''}</small>
    </div>
    <span class="result-time">${formatQualifyingTime(result)}</span>
    <strong class="result-points">P${result.position}</strong>
  </div>
`).join('')

const fastestLap = results => results.find(result => result.FastestLap?.rank === '1')

export function RaceResults() {
  return `
    <section class="results-panel" id="race-results" aria-live="polite">
      <div class="results-empty">
        <span class="eyebrow">Official results feed</span>
        <h2>Select a race weekend</h2>
        <p>Choose a completed round to load qualifying, sprint, and Grand Prix results.</p>
      </div>
    </section>
  `
}

export function renderResultsLoading(race) {
  return `
    <div class="results-empty">
      <span class="eyebrow">Round ${race.round}</span>
      <h2>${race.raceName}</h2>
      <p>Loading current Formula 1 data…</p>
      <div class="spinner" aria-hidden="true"></div>
    </div>
  `
}

export function renderWeekendResults(scheduleRace, weekend, selectedType = null) {
  const sessions = []

  if (weekend.qualifying?.QualifyingResults?.length) {
    sessions.push({
      type: 'qualifying',
      results: weekend.qualifying.QualifyingResults
    })
  }

  if (weekend.sprint?.SprintResults?.length) {
    sessions.push({
      type: 'sprint',
      results: weekend.sprint.SprintResults
    })
  }

  if (weekend.race?.Results?.length) {
    sessions.push({
      type: 'race',
      results: weekend.race.Results
    })
  }

  if (!sessions.length) {
    return `
      <div class="results-empty">
        <span class="eyebrow">Round ${scheduleRace.round}</span>
        <h2>${scheduleRace.raceName}</h2>
        <p>Official session results have not been published yet.</p>
      </div>
    `
  }

  const defaultSession = sessions.find(session => session.type === selectedType)
    ?? sessions.find(session => session.type === 'race')
    ?? sessions.at(-1)

  return `
    <div class="results-header">
      <div>
        <span class="eyebrow">Round ${scheduleRace.round} · ${scheduleRace.Circuit?.Location?.locality ?? ''}</span>
        <h2>${scheduleRace.raceName}</h2>
      </div>

      <label class="session-control" for="session-selector">
        <span>Session</span>
        <select id="session-selector">
          ${sessions.map(session => `
            <option value="${session.type}" ${session.type === defaultSession.type ? 'selected' : ''}>
              ${sessionLabel(session.type)}
            </option>
          `).join('')}
        </select>
      </label>
    </div>

    <div id="session-details">
      ${renderSession(defaultSession)}
    </div>
  `
}

export function renderSession(session) {
  const isQualifying = session.type === 'qualifying'
  const pole = isQualifying ? session.results[0] : null
  const fastest = !isQualifying ? fastestLap(session.results) : null

  return `
    <article class="session-results">
      <div class="session-title-row">
        <h3>${sessionLabel(session.type)}</h3>
        <span class="status-pill status-complete">Official data</span>
      </div>

      ${(pole || fastest) ? `
        <div class="session-highlights">
          ${pole ? `
            <div class="highlight-item">
              <span>🏎 Pole position</span>
              <strong>${driverName(pole)}</strong>
              <small>${formatQualifyingTime(pole)}</small>
            </div>
          ` : ''}
          ${fastest ? `
            <div class="highlight-item">
              <span>⚡ Fastest lap</span>
              <strong>${driverName(fastest)}</strong>
              <small>${fastest.FastestLap?.Time?.time ?? ''}</small>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <div class="results-list">
        ${isQualifying
          ? renderQualifyingRows(session.results)
          : renderRaceRows(session.results)}
      </div>
    </article>
  `
}
