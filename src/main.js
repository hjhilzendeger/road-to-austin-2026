import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="app">

    <header>
      <h1>🏁 Road to Austin 2026</h1>
      <p>Formula 1 Season Companion</p>
    </header>

    <main>

      <section class="hero">
        <h2>Countdown to Circuit of the Americas</h2>
        <div class="countdown">
          October 23-25, 2026
        </div>
      </section>

      <section class="cards">

        <div class="card">
          <h3>🏎 Drivers</h3>
          <p>Explore the 2026 grid</p>
        </div>

        <div class="card">
          <h3>🏆 Championship</h3>
          <p>Follow standings race by race</p>
        </div>

        <div class="card">
          <h3>📅 Race Explorer</h3>
          <p>Relive every Grand Prix</p>
        </div>

        <div class="card">
          <h3>▶ Championship Replay</h3>
          <p>Watch the season unfold</p>
        </div>

      </section>

    </main>

  </div>
`