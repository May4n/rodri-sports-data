import type { Handler } from '@netlify/functions'

const handler: Handler = async (event) => {
  const params = event.queryStringParameters ?? {}
  
  // Monta a query string com todos os parâmetros recebidos
  const query = new URLSearchParams(params as Record<string, string>).toString()
  const url = `https://v1.basketball.api-sports.io/standings?${query}`

  console.log('URL chamada:', url)

  const res = await fetch(url, {
    headers: {
      'x-apisports-key': process.env.VITE_API_FOOTBALL_KEY ?? '',
    },
  })

  const data = await res.json()

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}

export { handler }