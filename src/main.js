
import './style.css'
import { drivers } from './data/drivers.js'
import { teams } from './data/teams.js'
import { races } from './data/races.js'
import { results } from './data/results.js'
import { calculateStandings } from './utils/standings.js'
import { calculateConstructorStandings } from './utils/constructors.js'


import { Header } from './components/Header.js'
import { DriverStandings } from './components/DriverStandings.js'
import { ConstructorStandings } from './components/ConstructorStandings.js'
import { RaceResults } from './components/RaceResults.js'


const getTeam = (teamName) =>
  teams.find(team => team.name === teamName)

const selectedRace = races.find(
  race => race.completed
);

const standings = calculateStandings(
  results,
  selectedRace.id
);

const constructorStandings =
  calculateConstructorStandings(
    results,
    drivers,
    selectedRace.id
  );


document.querySelector('#app').innerHTML = `
  <div class="app">

${Header()}

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

<section class="cards">

${DriverStandings(standings, races)}

${ConstructorStandings(constructorStandings)}

</section>

${RaceResults()}

    </main>

  </div>
  
  `


document.querySelectorAll('.race-card')
.forEach(card => {

  card.addEventListener('click', () => {

    const raceId = Number(card.dataset.race);

    console.log("Clicked race:", raceId);

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
document
  .querySelector('#race-selector')
  .addEventListener('change', (event) => {

    const raceId = Number(event.target.value);

    const newStandings = calculateStandings(
      results,
      raceId
    );



const newConstructorStandings =
  calculateConstructorStandings(
    results,
    drivers,
    raceId
  );


    document.querySelector('#standings-list')
      .innerHTML = newStandings.map((driver, index) => `

        <p>
          ${index === 0 ? "🥇" :
            index === 1 ? "🥈" :
            "🥉"}

          ${driver.driver}
          —
          ${driver.points} pts
        </p>

      `).join('');

      document.querySelector('#constructor-list')
  .innerHTML = newConstructorStandings.map((team, index) => `

    <p>
      ${index === 0 ? "🥇" :
        index === 1 ? "🥈" :
        "🥉"}

      ${team.team}
      —
      ${team.points} pts
    </p>

  `).join('');

  });
