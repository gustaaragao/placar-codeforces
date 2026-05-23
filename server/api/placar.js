/* global defineEventHandler, process, createError, setResponseHeaders */
export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  })

  const API_KEY = process.env.API_KEY || ''
  const API_SECRET = process.env.API_SECRET || ''
  const CONTEST_ID = process.env.CONTEST_ID || ''
  const GROUP_CODE = process.env.GROUP_CODE || ''

  if (!API_KEY || !API_SECRET || !CONTEST_ID || !GROUP_CODE) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing Codeforces API credentials or contest info in .env',
    })
  }

  const method = 'contest.standings'
  const rand = Math.floor(100000 + Math.random() * 900000).toString()
  const currentTime = Math.floor(Date.now() / 1000).toString()

  const params = `apiKey=${API_KEY}&contestId=${CONTEST_ID}&groupCode=${GROUP_CODE}&time=${currentTime}`
  const toHash = `${rand}/${method}?${params}#${API_SECRET}`

  // Converte a string para Uint8Array
  const encoder = new TextEncoder()
  const data = encoder.encode(toHash)

  // Calcula o SHA-512 hash usando Web Crypto API nativa
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
      throw createError({
        statusCode: 400,
        statusMessage: json.comment || 'Codeforces API Error',
      })
    }
    return json
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Fetch error',
    })
  }
})
