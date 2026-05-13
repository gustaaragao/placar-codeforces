export async function fetchCodeforcesData() {
  try {
    const response = await fetch('/api/placar')
    const json = await response.json()
    return json
  } catch (err) {
    console.error('Fetch error from /placar endpoint:', err)
    return null
  }
}
