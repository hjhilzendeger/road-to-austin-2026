export function ConstructorStandings(constructorStandings) {
  return `
    <div class="card">

      <h2>🏢 Constructor Championship</h2>

      <div id="constructor-list">

        ${constructorStandings.map((team, index) => `

          <p>
            ${index === 0 ? "🥇" :
              index === 1 ? "🥈" :
              "🥉"}

            ${team.team}
            —
            ${team.points} pts
          </p>

        `).join('')}

      </div>

    </div>
  `;
}