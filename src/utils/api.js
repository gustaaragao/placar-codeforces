export async function fetchCodeforcesData() {
  try {
    const url = `/api/placar?t=${Date.now()}`
    const response = await fetch(url, { cache: 'no-store' })
    const json = await response.json()
    return json
  } catch (err) {
    console.error('Fetch error from /placar endpoint:', err)
    return null
  }
}
