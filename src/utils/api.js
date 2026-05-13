export async function fetchCodeforcesData() {
  const API_KEY = import.meta.env.API_KEY || ''
  const API_SECRET = import.meta.env.API_SECRET || ''
  const CONTEST_ID = import.meta.env.CONTEST_ID || ''
  const GROUP_CODE = import.meta.env.GROUP_CODE || ''

  if (!API_KEY || !API_SECRET || !CONTEST_ID || !GROUP_CODE) {
    console.error('Missing Codeforces API credentials or contest info in .env')
    return null
  }

  const method = 'contest.standings'
  const rand = Math.floor(100000 + Math.random() * 900000).toString()
  const currentTime = Math.floor(Date.now() / 1000).toString()

  const params = `apiKey=${API_KEY}&contestId=${CONTEST_ID}&groupCode=${GROUP_CODE}&time=${currentTime}`
  const toHash = `${rand}/${method}?${params}#${API_SECRET}`

  // Converte a string para Uint8Array
  const encoder = new TextEncoder()
  const data = encoder.encode(toHash)

  // Calcula o SHA-512 hash
  const hashBuffer = await crypto.subtle.digest('SHA-512', data)

  // Converte ArrayBuffer para hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  const apiSig = rand + hashHex
  const url = `https://codeforces.com/api/${method}?${params}&apiSig=${apiSig}`

  try {
    const response = await fetch(url)
    const json = await response.json()
    if (json.status !== 'OK') {
      console.error('Codeforces API Error:', json.comment)
      return null
    }
    return json
  } catch (err) {
    console.error('Fetch error:', err)
    return null
  }
}
