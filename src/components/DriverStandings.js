export function DriverStandings(standings, races) {
  return `
    <div class="card">

      <h2>🏆 Driver Championship</h2>

      <select id="race-selector">

        ${races
          .filter(race => race.completed)
          .map(race => `
            <option value="${race.id}">
              Round ${race.round}: ${race.name}
            </option>
          `).join('')}

      </select>

      <div id="standings-list">

        ${standings.map((driver, index) => `

          <p>
            ${index === 0 ? "🥇" :
              index === 1 ? "🥈" :
              "🥉"}

            ${driver.driver}
            —
            ${driver.points} pts
          </p>

        `).join('')}

      </div>

    </div>
  `;
}