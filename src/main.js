import './style.css'
import { drivers } from './data/drivers.js'
import { teams } from './data/teams.js'
import { races } from './data/races.js'
import { results } from './data/results.js'

const getTeam = (teamName) =>
  teams.find(team => team.name === teamName)

document.querySelector('#app').innerHTML = `
  <div class="app">

    <header>
      <h1>🏁 Road to Austin 2026</h1>
      <p>Formula 1 Season Companion</p>
    </header>

    <main>

<section class="cards">

${drivers.map(driver => `
  <div class="card">
    <h3>${driver.name}</h3>
   <p>
  <span style="
    display:inline-block;
    width:12px;
    height:12px;
    background:${getTeam(driver.team).liveryColor};
    border-radius:50%;
    margin-right:8px;
  "></span>

  ${driver.team}
</p>
    <p>${driver.nationality}</p>
    <p>
      Helmet Color:
      <span style="
        display:inline-block;
        width:20px;
        height:20px;
        background:${driver.helmetColor};
        border-radius:50%;
        vertical-align:middle;
      "></span>
    </p>
    <p>Points: ${driver.points}</p>
  </div>
`).join('')}

</section>
<section class="cards">

${races.map(race => `
  <div class="card race-card" data-race="${race.id}">

  <h3>
    ${race.completed ? "🏁" : "⏳"}
    Round ${race.round}: ${race.name}
  </h3>

  <p>${race.location}</p>

  <p>
    ${race.completed ? "Completed" : "Upcoming"}
  </p>

</div>

`).join('')}

</section>
<section class="hero" id="race-results">

  <h2>🏆 Race Results</h2>

  <p>
    Select a completed race to view results.
  </p>

</section>

    </main>

  </div>
`
document.querySelectorAll('.race-card')
.forEach(card => {

  card.addEventListener('click', () => {

    const raceId = Number(card.dataset.race);

    const raceResult = results.find(
      result => result.raceId === raceId
    );

    const panel = document.querySelector('#race-results');

    if (raceResult) {

      panel.innerHTML = `

        <h2>🏆 Race Results</h2>

        ${raceResult.results.map(result => `

          <p>
            ${result.position === 1 ? "🥇" :
              result.position === 2 ? "🥈" :
              "🥉"}

            ${result.driver}
            —
            ${result.points} points
          </p>

        `).join('')}

      `;

    }

  });

});