import './style.css'
import {
  clearApiCache,
  getConstructorStandings,
  getDriverStandings,
  getRaceWeekend,
  getSeasonSchedule
} from './api.js'
import { Header } from './components/Header.js'
import {
  DriverStandings,
  renderDriverStandingsList
} from './components/DriverStandings.js'
import {
  ConstructorStandings,
  renderConstructorStandingsList
} from './components/ConstructorStandings.js'
import {
  RaceResults,
  renderResultsLoading,
  renderSession,
  renderWeekendResults
} from './components/RaceResults.js'

const app = document.querySelector('#app')
const teamColors = new Map([
  ['McLaren', '#ff8700'],
  ['Mercedes', '#27f4d2'],
  ['Red Bull', '#3671c6'],
  ['Ferrari', '#e8002d'],
  ['Williams', '#64c4ff'],
  ['RB F1 Team', '#6692ff'],
  ['Aston Martin', '#229971'],
  ['Haas F1 Team', '#b6babd'],
  ['Alpine F1 Team', '#ff87bc'],
  ['Sauber', '#52e252'],
  ['Audi', '#f50537'],
  ['Cadillac', '#f2f2f2']
])

let races = []
let driverStandings = []
let constructorStandings = []
let selectedRound = null
let weekendCache = new Map()

const parseRaceDate = race => new Date(`${race.date}T${race.time || '23:59:59Z'}`)
const now = () => new Date()

const getLatestCompletedRound = schedule => {
  const completed = schedule.filter(race => parseRaceDate(race) < now())
  return completed.at(-1)?.round ?? null
}

const getNextRace = schedule => schedule.find(race => parseRaceDate(race) >= now()) ?? null

const formatRaceDate = race => parseRaceDate(race).toLocaleDateString(undefined, {
  month: 'short',
  day: 'numeric'
})

const raceState = race => {
  const raceDate = parseRaceDate(race)
  const difference = raceDate - now()

  if (difference < 0) return { label: 'Completed', className: 'status-complete' }
  if (difference < 1000 * 60 * 60 * 24 * 4) return { label: 'Race week', className: 'status-live' }
  return { label: 'Upcoming', className: 'status-upcoming' }
}

const renderDriverCards = standings => {
  if (!standings.length) {
    return '<p class="data-message">The driver grid will appear when standings data is available.</p>'
  }

  return standings.map(entry => {
    const driver = entry.Driver
    const constructor = entry.Constructors?.[0]
    const color = teamColors.get(constructor?.name) ?? '#888'

    return `
      <article class="card driver-card">
        <div class="driver-card-heading">
          <span class="team-dot" style="background:${color}"></span>
          <span>${constructor?.name ?? 'Formula 1'}</span>
        </div>
        <h3>${driver.givenName} ${driver.familyName}</h3>
        <p>${driver.nationality}</p>
        <div class="driver-card-footer">
          <span>#${driver.permanentNumber ?? '—'} · ${driver.code ?? ''}</span>
          <strong>${entry.points} pts</strong>
        </div>
      </article>
    `
  }).join('')
}

const renderRaceCards = schedule => schedule.map(race => {
  const state = raceState(race)
  const hasSprint = Boolean(race.Sprint)
  const isSelected = String(race.round) === String(selectedRound)

  return `
    <button class="card race-card ${isSelected ? 'is-selected' : ''}" type="button" data-round="${race.round}">
      <div class="race-card-topline">
        <span>Round ${race.round} · ${formatRaceDate(race)}</span>
        <span class="status-pill ${state.className}">${state.label}</span>
      </div>
      <h3>${race.raceName}</h3>
      <p>${race.Circuit?.Location?.locality}, ${race.Circuit?.Location?.country}</p>
      ${hasSprint ? '<span class="sprint-badge">⚡ Sprint weekend</span>' : ''}
    </button>
  `
}).join('')

function renderApp() {
  const nextRace = getNextRace(races)

  app.innerHTML = `
    <div class="app-shell">
      ${Header(new Date())}

      <main>
        ${nextRace ? `
          <section class="next-race-banner">
            <div>
              <span class="eyebrow">Next race</span>
              <h2>${nextRace.raceName}</h2>
              <p>${nextRace.Circuit?.Location?.locality}, ${nextRace.Circuit?.Location?.country}</p>
            </div>
            <strong>${parseRaceDate(nextRace).toLocaleString(undefined, {
              month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
            })}</strong>
          </section>
        ` : ''}

        <section class="section-block">
          <div class="section-heading">
            <span class="eyebrow">Current championship</span>
            <h2>Drivers</h2>
          </div>
          <div class="cards driver-grid">
            ${renderDriverCards(driverStandings)}
          </div>
        </section>

        <section class="section-block">
          <div class="section-heading">
            <span class="eyebrow">Official calendar</span>
            <h2>Race weekends</h2>
          </div>
          <div class="cards race-grid">
            ${renderRaceCards(races)}
          </div>
        </section>

        <section class="championship-grid">
          ${DriverStandings(driverStandings, races, selectedRound)}
          ${ConstructorStandings(constructorStandings)}
        </section>

        ${RaceResults()}
      </main>
    </div>
  `

  bindEvents()
}

function bindEvents() {
  document.querySelectorAll('.race-card').forEach(card => {
    card.addEventListener('click', () => showWeekend(card.dataset.round))
  })

  document.querySelector('#race-selector')?.addEventListener('change', event => {
    updateChampionships(event.target.value)
  })

  document.querySelector('#refresh-data')?.addEventListener('click', refreshAllData)
}

async function updateChampionships(round) {
  const driverList = document.querySelector('#standings-list')
  const constructorList = document.querySelector('#constructor-list')
  driverList.innerHTML = '<p class="data-message">Loading standings…</p>'
  constructorList.innerHTML = '<p class="data-message">Loading standings…</p>'

  try {
    const [drivers, constructors] = await Promise.all([
      getDriverStandings(round),
      getConstructorStandings(round)
    ])
    driverList.innerHTML = renderDriverStandingsList(drivers)
    constructorList.innerHTML = renderConstructorStandingsList(constructors)
  } catch (error) {
    driverList.innerHTML = `<p class="error-message">${error.message}</p>`
    constructorList.innerHTML = '<p class="error-message">Standings could not be loaded.</p>'
  }
}

async function showWeekend(round) {
  selectedRound = String(round)
  const scheduleRace = races.find(race => String(race.round) === selectedRound)
  const panel = document.querySelector('#race-results')

  if (!scheduleRace) return

  document.querySelectorAll('.race-card').forEach(card => {
    card.classList.toggle('is-selected', card.dataset.round === selectedRound)
  })

  panel.innerHTML = renderResultsLoading(scheduleRace)
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' })

  try {
    if (!weekendCache.has(selectedRound)) {
      weekendCache.set(selectedRound, await getRaceWeekend(selectedRound))
    }

    const weekend = weekendCache.get(selectedRound)
    panel.innerHTML = renderWeekendResults(scheduleRace, weekend)

    panel.querySelector('#session-selector')?.addEventListener('change', event => {
      const sessions = {
        qualifying: weekend.qualifying?.QualifyingResults
          ? { type: 'qualifying', results: weekend.qualifying.QualifyingResults }
          : null,
        sprint: weekend.sprint?.SprintResults
          ? { type: 'sprint', results: weekend.sprint.SprintResults }
          : null,
        race: weekend.race?.Results
          ? { type: 'race', results: weekend.race.Results }
          : null
      }
      const session = sessions[event.target.value]
      if (session) panel.querySelector('#session-details').innerHTML = renderSession(session)
    })
  } catch (error) {
    panel.innerHTML = `
      <div class="results-empty">
        <span class="eyebrow">Data unavailable</span>
        <h2>${scheduleRace.raceName}</h2>
        <p class="error-message">${error.message}</p>
      </div>
    `
  }
}

async function loadData() {
  app.innerHTML = `
    <div class="startup-loading">
      <div class="spinner" aria-hidden="true"></div>
      <h1>Road to Austin</h1>
      <p>Loading live 2026 Formula 1 data…</p>
    </div>
  `

  try {
    races = await getSeasonSchedule()
    selectedRound = getLatestCompletedRound(races)

    const [drivers, constructors] = selectedRound
      ? await Promise.all([
          getDriverStandings(selectedRound),
          getConstructorStandings(selectedRound)
        ])
      : [[], []]

    driverStandings = drivers
    constructorStandings = constructors
    renderApp()

    if (selectedRound) showWeekend(selectedRound)
  } catch (error) {
    app.innerHTML = `
      <div class="startup-error">
        <span class="eyebrow">Unable to load data</span>
        <h1>Road to Austin</h1>
        <p>${error.message}</p>
        <button class="refresh-button" id="retry-load" type="button">Try again</button>
      </div>
    `
    document.querySelector('#retry-load')?.addEventListener('click', refreshAllData)
  }
}

async function refreshAllData() {
  clearApiCache()
  weekendCache = new Map()
  await loadData()
}

loadData()
