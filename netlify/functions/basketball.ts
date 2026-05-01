import type { Handler } from '@netlify/functions'

const handler: Handler = async (event) => {
  try {
    const params = event.queryStringParameters ?? {}
    console.log('Params recebidos:', JSON.stringify(params))
    
    const query = new URLSearchParams(params as Record<string, string>).toString()
    const url = `https://v1.basketball.api-sports.io/standings?${query}`
    console.log('URL chamada:', url)
    
    const apiKey = process.env.VITE_API_FOOTBALL_KEY
    console.log('API Key presente:', !!apiKey)

    const res = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey ?? '',
        'x-rapidapi-host': 'v1.basketball.api-sports.io',
      },
    })

    console.log('Status resposta:', res.status)
    const data = await res.json()

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.log('Erro detalhado:', String(err))
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(err) }),
    }
  }
}

export { handler }