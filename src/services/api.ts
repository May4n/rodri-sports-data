//LÊ VARIAVEIS DO .ENV E GUARDA EM CONSTANTES NOMEADAS
const BASE_URL = '/api'; // APONTA PARA O PROXY LOCAL , NÃO PARA A API DIRETAMENTE
const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;

// CRIA UM TIPO QUE REPRESENTA A RESPOSTA ENRIQUECIDA COM METADADOS DA API
export interface ApiResponse<T> {
    data: T;
    requisicoesRestantes: number | null; // NULL QUANDO O HEADER NÃO VIER NA RESPOSTA
}

console.log('URL SENDO CHAMADA:', URL)
export async function apiFetch<T>(endpoint: string): Promise<ApiResponse<T>> {
    // Separa o caminho (/standings) dos query params (?league=71&season=2024)
  const [path, queryString] = endpoint.split('?')
  const params = new URLSearchParams(queryString)

  // Em produção, injeta o path como parâmetro da function
  // Em dev, mantém o comportamento original do proxy
  let url: string
  if (BASE_URL.includes('.netlify')) {
    params.set('endpoint', path)
    url = `${BASE_URL}?${params.toString()}`
  } else {
    url = `${BASE_URL}${endpoint}`
  }

  const response = await fetch(url, {
    headers: { 'x-apisport-key': API_KEY },
  })

//LÊ O HEADER E CONVERTE PARA NUMERO - ELE VEM COMO STRING
    const restantes = response.headers.get('x-ratelimit-request-remainig');
    const requisicoesRestantes = restantes ? parseInt(restantes, 10) : null;
    
    console.log(`Requisições restantes: ${requisicoesRestantes}`);

if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`)
}

    const body = await response.json()

// RETORNA TANTO OS DADOS QUANTO A INFORMAÇÃO DE LIMITE
    return {
        data: body.response as T,
        requisicoesRestantes,
    };
}