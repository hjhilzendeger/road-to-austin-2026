export function RaceResults() {
  return `
    <section class="hero" id="race-results">

      <h2>🏆 Race Results</h2>

      <p>Select a completed race to view results.</p>

    </section>
  `;
}

export function renderSession(session) {
  return `
    <div class="session-results">

      <h3>
        ${session.type === "sprint"
          ? "⚡ Sprint"
          : "🏁 Grand Prix"}
      </h3>

      ${session.pole
        ? `
        <p><strong>🏎 Pole Position</strong><br>
        ${session.pole}</p>
        `
        : ""}

      ${session.fastestLap
        ? `
        <p><strong>⚡ Fastest Lap</strong><br>
        ${session.fastestLap}</p>
        `
        : ""}

      ${session.driverOfTheDay
        ? `
        <p><strong>⭐ Driver of the Day</strong><br>
        ${session.driverOfTheDay}</p>
        `
        : ""}

      <hr>

      ${session.results.map(result => `
        <p>
          ${result.position === 1 ? "🥇" :
            result.position === 2 ? "🥈" :
            result.position === 3 ? "🥉" :
            `${result.position}.`}

          ${result.driver}
          —
          ${result.points} pts
        </p>
      `).join("")}

    </div>
  `;
}