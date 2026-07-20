export function Header(lastUpdated = null) {
  const updatedText = lastUpdated
    ? `Last refreshed ${lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : 'Live 2026 Formula 1 data'

  return `
    <header class="site-header">
      <span class="eyebrow">2026 season companion</span>
      <h1>Road to Austin</h1>
      <p>Current race calendar, official session results, and championship standings.</p>
      <div class="live-data-bar">
        <span><i class="live-dot"></i>${updatedText}</span>
        <button id="refresh-data" class="refresh-button" type="button">Refresh data</button>
      </div>
    </header>
  `
}
