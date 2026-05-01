import { useState, useEffect } from 'react'
import { fetchNBAStandings, } from '../services/basketballApi'
import type { NBATeamStanding } from '../services/basketballApi'

export function useDadosNBA(season: string) {
    const [times, setTimes] = useState<NBATeamStanding[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

useEffect(() => {
    if (!season) return
    
    let cancelled = false  // evita setState em componente desmontado
    
    const load = async () => {
      setLoading(true)   // dentro de função async, não direto no effect
      setError(false)
      try {
        const data = await fetchNBAStandings(season)
        if (!cancelled) setTimes(data)
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [season])

    return { times, loading, error }
}