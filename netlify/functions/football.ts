import type { Handler } from '@netlify/functions'

const handler: Handler = async (event) => {
  // Recebe o caminho completo do endpoint como query param
  // Ex: ?endpoint=/standings&league=71&season=2024
  const { endpoint, ...rest } = event.queryStringParameters ?? {}

  // Monta a query string com os demais parâmetros
  const query = new URLSearchParams(rest as Record<string, string>).toString()
  const url = `https://v3.football.api-sports.io${endpoint}${query ? '?' + query : ''}`

  const res = await fetch(url, {
    headers: {
      // Em produção, usa a variável de ambiente do painel do Netlify
      'x-apisports-key': process.env.VITE_API_FOOTBALL_KEY ?? '',
    },
  })

  // Captura o header de rate limit para repassar ao frontend
  const remaining = res.headers.get('x-ratelimit-requests-remaining')
  const data = await res.json()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      // Repassa o header para o frontend conseguir ler requisicoesRestantes
      'x-ratelimit-requests-remaining': remaining ?? '',
    },
    body: JSON.stringify(data),
  }
}

export { handler }