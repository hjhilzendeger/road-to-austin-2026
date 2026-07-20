const API_BASE = 'https://api.jolpi.ca/ergast/f1'
const SEASON = 2026
const CACHE_PREFIX = 'road-to-austin:f1:'
const CACHE_TTL = 1000 * 60 * 30

const requestCache = new Map()

function readPersistentCache(url) {
  try {
    const value = localStorage.getItem(`${CACHE_PREFIX}${url}`)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

function writePersistentCache(url, data) {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${url}`, JSON.stringify({ savedAt: Date.now(), data }))
  } catch {
    // Storage may be unavailable; live requests still work.
  }
}

async function request(path) {
  const url = `${API_BASE}/${path}`
  const cached = readPersistentCache(url)

  if (cached && Date.now() - cached.savedAt < CACHE_TTL) return cached.data

  if (!requestCache.has(url)) {
    requestCache.set(url, fetch(url, { headers: { Accept: 'application/json' } })
      .then(async response => {
        if (!response.ok) throw new Error(`Formula 1 data request failed (${response.status}).`)
        const data = await response.json()
        writePersistentCache(url, data)
        return data
      })
      .catch(error => {
        requestCache.delete(url)
        if (cached?.data) return cached.data
        throw error
      }))
  }

  return requestCache.get(url)
}

const raceTable = data => data?.MRData?.RaceTable?.Races ?? []
const standingsLists = data => data?.MRData?.StandingsTable?.StandingsLists ?? []

export async function getSeasonSchedule() {
  return raceTable(await request(`${SEASON}.json`))
}

export async function getDriverStandings(round = null) {
  const path = round ? `${SEASON}/${round}/driverstandings.json` : `${SEASON}/driverstandings.json`
  return standingsLists(await request(path))[0]?.DriverStandings ?? []
}

export async function getConstructorStandings(round = null) {
  const path = round ? `${SEASON}/${round}/constructorstandings.json` : `${SEASON}/constructorstandings.json`
  return standingsLists(await request(path))[0]?.ConstructorStandings ?? []
}

export async function getRaceWeekend(round) {
  const [raceResponse, sprintResponse, qualifyingResponse] = await Promise.allSettled([
    request(`${SEASON}/${round}/results.json`),
    request(`${SEASON}/${round}/sprint.json`),
    request(`${SEASON}/${round}/qualifying.json`)
  ])
  return {
    race: raceResponse.status === 'fulfilled' ? raceTable(raceResponse.value)[0] ?? null : null,
    sprint: sprintResponse.status === 'fulfilled' ? raceTable(sprintResponse.value)[0] ?? null : null,
    qualifying: qualifyingResponse.status === 'fulfilled' ? raceTable(qualifyingResponse.value)[0] ?? null : null
  }
}

export function clearApiCache() {
  requestCache.clear()
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key))
  } catch {
    // Ignore storage cleanup failures.
  }
}
