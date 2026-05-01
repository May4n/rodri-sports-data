export interface NBATeamStanding {
  position: number
  team: { id: number; name: string; logo: string }
  games: {
    win: { total: number }
    lose: { total: number }
  }
points : {
  for: number
  against: number
  }
}

export async function fetchNBAStandings(season: string): Promise<NBATeamStanding[]> {
  const basketballBase = import.meta.env.VITE_BASKETBALL_API_BASE_URL ?? '/api-basketball'
  const url = `${basketballBase}/standings?league=12&season=${season}`
  console.log('Fetching players:', url)
  const res = await fetch(url)
  const json = await res.json()

  const raw = (json.response ?? []) as unknown[]
  const result = raw.flatMap((item) => Array.isArray(item) ? item : [item])

  const seen = new Set()
  const depuded = result.filter(t => {
    if (seen.has(t.team?.id)) return false
    seen.add(t.team?.id)
    return true
  })
  return depuded as NBATeamStanding[]
}
